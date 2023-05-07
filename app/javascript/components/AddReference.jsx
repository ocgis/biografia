import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Input, List } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ReactCrop from 'react-image-crop';
import { throttle } from 'throttle-debounce';
import {
  errorText, getRequest, loadData, saveData,
} from './Requests';
import {
  apiUrl, editObject, oneName, showObject,
} from './Mappings';

class AddReference extends React.Component {
  constructor(props) {
    super(props);

    const { referFrom } = props;

    this.state = {
      searchString: '',
      found: [],
      selectedItem: null,
      referFrom,
      reference: {
        name: '',
        type1: referFrom._type_,
        id1: referFrom.id,
        type2: null,
        id2: null,
        position_in_pictures: null,
      },
      addType: null,
      crop: {
        unit: '%',
      },
    };

    this.clickTimer = null;
  }

  componentDidMount() {
    const onLoaded = (data) => {
      const { referFrom } = this.state;
      this.setState({ referFrom: data[oneName(referFrom._type_)] });
    };

    const { referFrom, searchString } = this.state;

    this.search(searchString);

    if (referFrom.related == null) {
      loadData(apiUrl(referFrom._type_, referFrom.id), oneName(referFrom._type_), onLoaded, false);
    }
  }

  search = (searchString) => {
    const handleResponse = (response) => {
      const found = response.data.result;
      this.setState({ found, searchString });
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };
    const encodedSearch = encodeURIComponent(searchString);
    getRequest(apiUrl('Reference', `list?q=${encodedSearch}`), handleResponse, handleError);
  };

  render() {
    const handleResult = (result) => {
      if (result.error == null) {
        const onLoaded = (data) => {
          const { referFrom } = this.state;
          this.setState((prevState) => ({
            referFrom: data[oneName(referFrom._type_)],
            selectedItem: null,
            addType: null,
            reference: {
              ...prevState.reference,
              name: '',
              type2: null,
              id2: null,
              position_in_pictures: null,
            },
            crop: {
              unit: '%',
            },
          }));
        };

        const { referFrom } = this.state;

        loadData(
          apiUrl(referFrom._type_, referFrom.id),
          oneName(referFrom._type_),
          onLoaded,
          false,
        );
      } else {
        this.setState({ error: result.error });
      }
    };

    const addItemReference = (selectedItem) => {
      const saveReference = (item) => {
        const { reference } = this.state;

        const saveValue = {
          reference: {
            ...reference,
            type2: item._type_,
            id2: item.id,
          },
        };
        saveData('Reference', saveValue, handleResult);
      };

      const handleSaveNewItemResult = (attrName, result) => {
        if (result.error == null) {
          saveReference(result[attrName]);
        } else {
          this.setState({ error: result.error });
        }
      };

      const saveNewItem = (item) => {
        const {
          id, created_at, updated_at, _type_, ...newItem
        } = item;
        const saveValue = {};
        if (item._type_ === 'EventDate') {
          newItem.date = moment(newItem.date).format(newItem.mask);
        }
        saveValue[oneName(_type_)] = newItem;
        saveData(
          _type_,
          saveValue,
          (result) => handleSaveNewItemResult(oneName(item._type_), result),
        );
      };

      if (selectedItem._type_ === 'EventDate') {
        saveNewItem(selectedItem);
      } else {
        saveReference(selectedItem);
      }
    };

    const searchObject = throttle(500, this.search);

    const closeButtonClicked = () => {
      const { onOk } = this.props;
      onOk();
    };

    const onSingleClick = (item) => {
      this.setState((prevState) => ({
        selectedItem: item,
        reference: {
          ...prevState.reference,
          name: item._type_,
        },
      }));
    };

    const onDoubleClick = (item) => {
      addItemReference(item, item._type_);
    };

    const onClick = (event, item) => {
      clearTimeout(this.clickTimer);
      if (event.detail === 1) {
        this.clickTimer = setTimeout(() => onSingleClick(item), 300);
      } else if (event.detail === 2) {
        onDoubleClick(item);
      }
    };

    const onCropChange = (_, newCrop) => {
      const { reference } = this.state;
      if (newCrop.width > 0 && newCrop.height > 0) {
        reference.position_in_pictures = [{
          x: newCrop.x * 10.0,
          y: newCrop.y * 10.0,
          width: newCrop.width * 10.0,
          height: newCrop.height * 10.0,
        }];
      } else {
        reference.position_in_pictures = null;
      }
      this.setState({
        reference,
        crop: newCrop,
        error: null,
      });
    };

    const renderItem = (item) => {
      const { currentUser } = this.props;
      const ShowObject = showObject(item._type_);
      return (
        <List.Item onClick={(event) => onClick(event, item)}>
          <ShowObject
            object={item}
            mode="oneLine"
            currentUser={currentUser}
            reload={() => {}}
          />
        </List.Item>
      );
    };

    const onChange = (value) => {
      searchObject(value.target.value);
    };

    const { Search } = Input;
    const {
      crop, found, error, searchString, reference, referFrom, selectedItem, addType,
    } = this.state;

    let ignoredItems = [{ _type_: referFrom._type_, id: referFrom.id }];
    if (referFrom.related != null) {
      Object.keys(referFrom.related).forEach((key) => {
        ignoredItems = ignoredItems.concat(referFrom.related[key].map((obj) => {
          if (obj._type_ === 'EventDate') {
            const {
              id, created_at, updated_at, reference: ref_, ...strippedItem
            } = obj;
            return strippedItem;
          }
          return { _type_: obj._type_, id: obj.id };
        }));
      });
    }

    if (selectedItem !== null) {
      if (selectedItem._type_ === 'EventDate') {
        const editItem = JSON.parse(JSON.stringify(selectedItem));
        editItem.id = undefined;
        const EditObject = editObject(editItem._type_);
        return (
          <table>
            <tbody>
              <tr>
                <td>
                  <EditObject
                    object={editItem}
                    extraData={{ referFrom }}
                    onOk={handleResult}
                    onCancel={() => this.setState((prevState) => ({
                      addType: null,
                      selectedItem: null,
                      reference: {
                        ...prevState.reference,
                        name: '',
                        type2: null,
                        id2: null,
                        position_in_pictures: null,
                      },
                      crop: {
                        unit: '%',
                      },
                    }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        );
      }

      const { currentUser } = this.props;
      const ShowReferredObject = showObject(referFrom._type_);
      const ShowSelectedObject = showObject(selectedItem._type_);
      return (
        <table>
          <tbody>
            <tr>
              <td>
                { 'Refererar till ' }
                <ShowReferredObject object={referFrom} mode="oneLine" />
              </td>
            </tr>
            <tr>
              <td>
                Roll:
              </td>
              <td>
                <Input
                  defaultValue={reference.name}
                  onChange={(event) => this.setState((prevState) => ({
                    reference: {
                      ...prevState.reference,
                      name: event.target.value,
                    },
                  }))}
                />
              </td>
            </tr>
            <tr>
              <td>
                <ShowSelectedObject
                  object={selectedItem}
                  mode="full"
                  currentUser={currentUser}
                  reload={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>
                <CheckOutlined onClick={() => addItemReference(selectedItem)} />
                <CloseOutlined onClick={() => this.setState({ selectedItem: null })} />
                { error }
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    if (addType !== null) {
      const EditObject = editObject(addType);
      return (
        <table>
          <tbody>
            <tr>
              <td>
                <EditObject
                  extraData={{ reference }}
                  onOk={handleResult}
                  onCancel={() => this.setState((prevState) => ({
                    addType: null,
                    selectedItem: null,
                    reference: {
                      ...prevState.reference,
                      name: '',
                      type2: null,
                      id2: null,
                      position_in_pictures: null,
                    },
                    crop: {
                      unit: '%',
                    },
                  }))}
                />
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    const filtered = found.filter((x) => {
      const itemMatches = (i1, i2) => {
        const keys1 = Object.keys(i1);
        for (let i = 0; i < keys1.length; i += 1) {
          const key = keys1[i];
          if (i1[key] !== i2[key]) {
            return false;
          }
        }
        return true;
      };

      for (let i = 0; i < ignoredItems.length; i += 1) {
        if (itemMatches(ignoredItems[i], x)) {
          return false;
        }
      }
      return true;
    });
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Person',
                  reference: {
                    ...prevState.reference,
                    name: 'Person',
                  },
                }))}
              >
                Ny person
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Event',
                  reference: {
                    ...prevState.reference,
                    name: 'Event',
                  },
                }))}
              >
                Ny händelse
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'EventDate',
                  reference: {
                    ...prevState.reference,
                    name: 'Date',
                  },
                }))}
              >
                Nytt datum
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Address',
                  reference: {
                    ...prevState.reference,
                    name: 'Address',
                  },
                }))}
              >
                Ny adress
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Thing',
                  reference: {
                    ...prevState.reference,
                    name: 'Thing',
                  },
                }))}
              >
                Ny sak
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Note',
                  reference: {
                    ...prevState.reference,
                    name: 'Note',
                  },
                }))}
              >
                Ny kommentar
              </Button>
              <Button
                onClick={() => this.setState((prevState) => ({
                  addType: 'Relationship',
                  reference: {
                    ...prevState.reference,
                    name: 'Relationship',
                  },
                }))}
              >
                Nytt förhållande
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <Search
                defaultValue={searchString}
                onChange={onChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <List
                bordered
                size="small"
                dataSource={filtered}
                renderItem={renderItem}
                style={{
                  overflow: 'auto',
                  height: '300px',
                  width: '500px',
                }}
              />
            </td>
            { referFrom._type_ === 'Medium'
              && (
                <td>
                  <ReactCrop
                    src={apiUrl('Medium', referFrom.id, 'image')}
                    crop={crop}
                    onChange={onCropChange}
                  />
                </td>
              )}
          </tr>
          <tr>
            <td>
              <CloseOutlined onClick={closeButtonClicked} />
              { error }
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
AddReference.propTypes = {
  onOk: PropTypes.func.isRequired,
  referFrom: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    related: PropTypes.shape(),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};
AddReference.defaultProps = {
};

export default AddReference;
