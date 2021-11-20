import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import SaveData from './SaveData';

class TagMedium extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'reference';
    this.apiUrl = '/api/v1/references';
    this.state = {
      value: null,
      descriptionOptions: [],
      reference: {
        type1: props.referFrom.type_,
        id1: props.referFrom.id,
        type2: null,
        id2: null,
        position_in_pictures: null,
      },
      crop: {
        unit: '%',
      },
      error: null,
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
      const { type2, id2, position_in_pictures } = this.state.reference;
      if (type2 == null || id2 == null || position_in_pictures == null) {
        this.setState({ error: 'Välj referens och position' });
      } else {
        this.saveData(handleResult);
      }
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
        this.setState({
          descriptionOptions: response.data.result,
          error: null,
        });
      }).catch((error) => {
        console.log('ERROR', error);
      });
    });

    const onChange = (value) => {
      this.setState({
        value,
        error: null,
      });
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

    const {
      descriptionOptions, crop, error, value,
    } = this.state;
    const { referFrom } = this.props;

    const options = descriptionOptions.map((val, index) => ({
      value: index,
      label: val.value,
    }));

    const onCropChange = (_, newCrop) => {
      if (newCrop.width > 0 && newCrop.height > 0) {
        this.state.reference.position_in_pictures = [{
          x: newCrop.x * 10.0,
          y: newCrop.y * 10.0,
          width: newCrop.width * 10.0,
          height: newCrop.height * 10.0,
        }];
      } else {
        this.state.reference.position_in_pictures = null;
      }
      this.setState({
        reference: this.state.reference,
        crop: newCrop,
        error: null,
      });
    };

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <ReactCrop
                src={`/media/${referFrom.id}/image`}
                crop={crop}
                onChange={onCropChange}
              />
            </td>
          </tr>
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
TagMedium.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  referFrom: PropTypes.shape({
    type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
TagMedium.defaultProps = {
};

export default TagMedium;
