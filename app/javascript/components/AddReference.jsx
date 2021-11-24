import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import SaveData from './SaveData';
import { apiUrl } from './Mappings';

class AddReference extends SaveData {
  constructor(props) {
    super(props, 'Reference');
    this.state = {
      value: null,
      descriptionOptions: [],
      reference: {
        type1: props.referFrom.type_,
        id1: props.referFrom.id,
        type2: null,
        id2: null,
      },
    };
  }

  render = () => {
    const handleResult = (result) => {
      const { onOk } = this.props;

      if (result.error == null) {
        onOk(result);
      } else {
        this.setState({ error: result.error });
      }
    };

    const okButtonClicked = () => {
      this.saveData(handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const searchObject = throttle(500, (searchString) => {
      const csrfToken = document.querySelector('[name=csrf-token]').content;
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

      const encodedSearch = encodeURIComponent(searchString);
      const { _type_ } = this;
      axios.get(apiUrl(_type_, `list?q=${encodedSearch}`)).then((response) => {
        this.state.descriptionOptions = response.data.result;
        this.setState(this.state);
      }).catch((error) => {
        console.log(error);
        this.setState({ error: 'An exception was raised. Check the console.' });
      });
    });

    const onChange = (value) => {
      this.setState({ value });
    };

    const onSelect = (index, object) => {
      const option = this.state.descriptionOptions[index];
      this.state.reference.type2 = option.key.type_;
      this.state.reference.id2 = option.key.id;
      this.setState({
        reference: this.state.reference,
        value: object.label,
      });
    };

    const { descriptionOptions, error, value } = this.state;

    const options = descriptionOptions.map((val, index) => ({
      value: index,
      label: val.value,
    }));

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <AutoComplete
                value={value}
                style={{ width: '50ch' }}
                options={options}
                onSearch={(search) => searchObject(search)}
                onChange={onChange}
                onSelect={onSelect}
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
    type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
AddReference.defaultProps = {
};

export default AddReference;
