import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import SaveData from './SaveData';

class AddReference extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'reference';
    this.apiUrl = '/api/v1/references';
    this.state = {
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
      axios.get(`/api/v1/references/list?q=${encodedSearch}`).then((response) => {
        this.state.descriptionOptions = response.data.result;
        this.setState(this.state);
      }).catch((error) => {
        console.log("ERROR", error);
      });
    });

    const setSelected = (value, object) => {
      this.state.reference.type2 = object.key.type_;
      this.state.reference.id2 = object.key.id;
      this.setState({ reference: this.state.reference });
    };

    const { descriptionOptions, error } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <AutoComplete
                style={{ width: '50ch' }}
                options={descriptionOptions}
                onSearch={(search) => searchObject(search)}
                onSelect={setSelected}
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
