import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, List } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
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
      referenceName: '',
      addType: null,
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
    const addItemReference = (selectedItem, referenceName) => {
      const handleResult = (result) => {
        if (result.error == null) {
          const onLoaded = (data) => {
            const { referFrom } = this.state;
            this.setState({
              referFrom: data[oneName(referFrom._type_)],
              selectedItem: null,
            });
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

      const { referFrom } = this.state;

      const saveValue = {
        reference: {
          name: referenceName,
          type1: referFrom._type_,
          id1: referFrom.id,
          type2: selectedItem._type_,
          id2: selectedItem.id,
        },
      };
      saveData('Reference', saveValue, handleResult);
    };

    const searchObject = throttle(500, this.search);

    const closeButtonClicked = () => {
      const { onOk } = this.props;
      onOk();
    };

    const onSingleClick = (item) => {
      this.setState({
        selectedItem: item,
        referenceName: item._type_,
      });
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
      found, error, searchString, referenceName, referFrom, selectedItem, addType,
    } = this.state;

    let ignoredKeys = [`${referFrom._type_}_${referFrom.id}`];
    if (referFrom.related != null) {
      Object.keys(referFrom.related).forEach((key) => {
        ignoredKeys = ignoredKeys.concat(referFrom.related[key].map((obj) => `${obj._type_}_${obj.id}`));
      });
    }

    if (selectedItem !== null) {
      const { currentUser } = this.props;
      const ShowObject = showObject(referFrom._type_);
      return (
        <table>
          <tbody>
            <tr>
              <td>
                { 'Refererar till ' }
                <ShowObject object={referFrom} mode="oneLine" />
              </td>
            </tr>
            <tr>
              <td>
                Roll:
              </td>
              <td>
                <Input
                  defaultValue={referenceName}
                  onChange={(event) => this.setState({
                    referenceName: event.target.value,
                  })}
                />
              </td>
            </tr>
            <tr>
              <td>
                <ShowObject
                  object={selectedItem}
                  mode="full"
                  currentUser={currentUser}
                  reload={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>
                <CheckOutlined onClick={() => addItemReference(selectedItem, referenceName)} />
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
                  extraData={{ referFrom }}
                  onOk={() => this.setState({ addType: null, referenceName: '' })}
                />
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    const filtered = found.filter((x) => !ignoredKeys.includes(`${x._type_}_${x.id}`));
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Button onClick={() => this.setState({ addType: 'Person', referenceName: 'Person' })}>Ny person</Button>
              <Button onClick={() => this.setState({ addType: 'Event', referenceName: 'Event' })}>Ny händelse</Button>
              <Button onClick={() => this.setState({ addType: 'EventDate', referenceName: 'Date' })}>Nytt datum</Button>
              <Button onClick={() => this.setState({ addType: 'Address', referenceName: 'Address' })}>Ny adress</Button>
              <Button onClick={() => this.setState({ addType: 'Thing', referenceName: 'Thing' })}>Ny sak</Button>
              <Button onClick={() => this.setState({ addType: 'Note', referenceName: 'Note' })}>Ny kommentar</Button>
              <Button onClick={() => this.setState({ addType: 'Förhållande', referenceName: 'Relationship' })}>Nytt förhållande</Button>
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
