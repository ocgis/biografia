import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { errorText, getRequest, saveData } from './Requests';
import { apiUrl, showObject } from './Mappings';

class TagMedium extends React.Component {
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
        position_in_pictures: null,
      },
      crop: {
        unit: '%',
      },
      error: null,
    };
  }

  render() {
    const handleResult = (result) => {
      const { onOk } = this.props;

      if (result.error == null) {
        onOk(result);
      } else {
        this.setState({ error: result.error });
      }
    };

    const okButtonClicked = () => {
      const { reference: { type2, id2, position_in_pictures } } = this.state;
      if (type2 == null || id2 == null || position_in_pictures == null) {
        this.setState({ error: 'Välj referens och position' });
      } else {
        saveData('Reference', this.state, handleResult);
      }
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const searchObject = throttle(500, (searchString) => {
      const handleResponse = (response) => {
        this.setState({
          descriptionOptions: response.data.result,
          error: null,
        });
      };

      const handleError = (error) => {
        this.setState({ error: errorText(error) });
      };

      const encodedSearch = encodeURIComponent(searchString);
      getRequest(apiUrl('Reference', `list?q=${encodedSearch}`), handleResponse, handleError);
    });

    const onChange = (value) => {
      this.setState({
        value,
        error: null,
      });
    };

    const onSelect = (index) => {
      const { descriptionOptions: { [index]: option }, reference } = this.state;
      reference.type2 = option._type_;
      reference.id2 = option.id;
      this.setState({
        reference,
      });
      okButtonClicked();
    };

    const {
      descriptionOptions, crop, error, value,
    } = this.state;
    const { referFrom } = this.props;

    const options = descriptionOptions.map((item, index) => {
      const ShowObject = showObject(item._type_);
      return ({
        value: index,
        label: (
          <ShowObject
            object={item}
            mode="oneLine"
            currentUser={{}}
            reload={() => {}}
          />
        ),
      });
    });

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

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <ReactCrop
                src={apiUrl('Medium', referFrom.id, 'image')}
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
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
TagMedium.defaultProps = {
};

export default TagMedium;
