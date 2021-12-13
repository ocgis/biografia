import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import { errorText, getRequest, saveData } from './Requests';
import { apiUrl } from './Mappings';

class AddReference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      descriptionOptions: [],
      reference: {
        type1: props.referFrom._type_,
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
      saveData('Reference', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const searchObject = throttle(500, (searchString) => {
      const handleResponse = (response) => {
        const descriptionOptions = response.data.result;
        this.setState({ descriptionOptions });
      };

      const handleError = (error) => {
        this.setState({ error: errorText(error) });
      };

      const encodedSearch = encodeURIComponent(searchString);
      getRequest(apiUrl('Reference', `list?q=${encodedSearch}`), handleResponse, handleError);
    });

    const onChange = (value) => {
      this.setState({ value });
    };

    const onSelect = (index, object) => {
      const { descriptionOptions: { [index]: option }, reference } = this.state;
      reference.type2 = option.key._type_;
      reference.id2 = option.key.id;
      this.setState({
        reference,
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
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
AddReference.defaultProps = {
};

export default AddReference;
