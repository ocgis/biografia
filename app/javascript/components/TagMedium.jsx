import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { throttle } from 'throttle-debounce';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  errorText, getRequest, loadData, saveData,
} from './Requests';
import { apiUrl, oneName, showObject } from './Mappings';

class TagMedium extends React.Component {
  constructor(props) {
    super(props);

    const { referFrom } = props;

    this.state = {
      value: null,
      descriptionOptions: [],
      reference: {
        type1: referFrom._type_,
        id1: referFrom.id,
        type2: null,
        id2: null,
        position_in_pictures: [],
      },
      referFrom,
      selected: [],
      crop: {
        unit: '%',
      },
      error: null,
    };
  }

  componentDidMount() {
    const onLoaded = (data) => {
      const { referFrom } = this.state;
      this.setState({ referFrom: data[oneName(referFrom._type_)] });
    };

    const { referFrom } = this.state;

    this.search('');

    if (referFrom.related == null) {
      loadData(apiUrl(referFrom._type_, referFrom.id), oneName(referFrom._type_), onLoaded, false);
    }
  }

  search = (searchString) => {
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
  };

  render() {
    const okButtonClicked = () => {
      const { onOk } = this.props;
      onOk({});
    };

    const searchObject = throttle(500, this.search);

    const onChange = (value) => {
      this.setState({
        value,
        error: null,
      });
    };

    const handleResult = (result) => {
      const { referFrom } = this.state;
      if (result.error == null) {
        this.setState({
          value: null,
          reference: {
            type1: referFrom._type_,
            id1: referFrom.id,
            type2: null,
            id2: null,
            position_in_pictures: [],
          },
          crop: {
            unit: '%',
          },
        });
        this.search('');
      } else {
        this.setState({ error: result.error });
      }
    };

    const onSelect = (option) => {
      const { reference } = this.state;
      reference.type2 = option._type_;
      reference.id2 = option.id;
      this.setState((prevState) => ({
        selected: [...prevState.selected, option],
      }));
      saveData('Reference', { reference }, handleResult);
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
        reference.position_in_pictures = [];
      }
      this.setState({
        reference,
        crop: newCrop,
        error: null,
      });
    };

    const {
      descriptionOptions, crop, error, reference, selected, value,
    } = this.state;
    const { referFrom } = this.state;

    let ignoredKeys = [`${referFrom._type_}_${referFrom.id}`];
    if (referFrom.related != null) {
      Object.keys(referFrom.related).forEach((key) => {
        ignoredKeys = ignoredKeys.concat(referFrom.related[key].map((obj) => `${obj._type_}_${obj.id}`));
      });
    }

    ignoredKeys = ignoredKeys.concat(selected.map((x) => `${x._type_}_${x.id}`));

    const filtered = descriptionOptions.filter((x) => !ignoredKeys.includes(`${x._type_}_${x.id}`));

    const options = filtered.map((item, index) => {
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
          { reference.position_in_pictures !== []
            && (
              <tr>
                <td>
                  <AutoComplete
                    value={value}
                    style={{ width: '50ch' }}
                    options={options}
                    onSearch={(search) => searchObject(search)}
                    onChange={onChange}
                    onSelect={(index) => onSelect(filtered[index])}
                    open
                  />
                </td>
              </tr>
            )}
          <tr>
            <td>
              <CheckOutlined onClick={okButtonClicked} />
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
  referFrom: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    related: PropTypes.shape(),
  }).isRequired,
};
TagMedium.defaultProps = {
};

export default TagMedium;
