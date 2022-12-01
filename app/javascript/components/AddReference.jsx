import React from 'react';
import PropTypes from 'prop-types';
import { Input, List } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import { errorText, getRequest, saveData } from './Requests';
import { apiUrl, showObject } from './Mappings';

class AddReference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      found: [],
      selected: [],
    };
  }

  componentDidMount() {
    this.search('');
  }

  search = (searchString) => {
    const handleResponse = (response) => {
      const found = response.data.result;
      this.setState({ found });
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };
    const encodedSearch = encodeURIComponent(searchString);
    getRequest(apiUrl('Reference', `list?q=${encodedSearch}`), handleResponse, handleError);
  };

  render() {
    const okButtonClicked = () => {
      const handleResult = (result) => {
        if (result.error == null) {
          okButtonClicked();
        } else {
          this.setState({ error: result.error });
        }
      };

      const { onOk, referFrom } = this.props;
      const { selected } = this.state;

      if (selected.length === 0) {
        onOk();
      } else {
        const saveValue = {
          reference: {
            type1: referFrom._type_,
            id1: referFrom.id,
            type2: selected[0]._type_,
            id2: selected[0].id,
          },
        };
        this.setState((prevState) => ({
          selected: prevState.selected.slice(1),
        }));
        saveData('Reference', saveValue, handleResult);
      }
    };

    const searchObject = throttle(500, this.search);

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const addItemToSelected = (item) => {
      this.setState((prevState) => ({
        selected: [item, ...prevState.selected],
      }));
    };

    const renderItem = (item) => {
      const ShowObject = showObject(item._type_);
      return (
        <List.Item onClick={() => addItemToSelected(item)}>
          <ShowObject
            object={item}
            mode="oneLine"
            currentUser={{}}
            reload={() => {}}
          />
        </List.Item>
      );
    };

    const renderSelectedItem = (item) => {
      const ShowObject = showObject(item._type_);
      return (
        <List.Item>
          <ShowObject
            object={item}
            mode="oneLine"
            currentUser={{}}
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
      found, error, selected,
    } = this.state;
    const { referFrom } = this.props;

    let ignoredKeys = [`${referFrom._type_}_${referFrom.id}`];
    Object.keys(referFrom.related).forEach((key) => {
      ignoredKeys = ignoredKeys.concat(referFrom.related[key].map((obj) => `${obj._type_}_${obj.id}`));
    });

    ignoredKeys = ignoredKeys.concat(selected.map((x) => `${x._type_}_${x.id}`));

    const filtered = found.filter((x) => !ignoredKeys.includes(`${x._type_}_${x.id}`));
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Search
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
            <td>
              <List
                bordered
                size="small"
                dataSource={selected}
                renderItem={renderSelectedItem}
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
              <CheckOutlined onClick={okButtonClicked} />
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
  onCancel: PropTypes.func.isRequired,
  referFrom: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    related: PropTypes.shape().isRequired,
  }).isRequired,
};
AddReference.defaultProps = {
};

export default AddReference;
