import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  loadData,
} from './Requests';
import {
  apiUrl, manyName, showObject, filterFields, filterObject, editObject,
} from './Mappings';

class Merge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionOptions: [],
      selected: [],
      selectedDone: false,
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    const { object: { _type_, id } } = this.props;

    const onLoaded = (data) => {
      const { state } = this;
      const objectName = manyName(_type_);
      const options = data[objectName].filter((o) => o.id !== id);
      if (state.descriptionOptions == null) {
        this.setState({ descriptionOptions: options });
      } else {
        this.setState({ descriptionOptions: state.descriptionOptions.concat(options) });
      }
    };

    loadData(apiUrl(_type_), manyName(_type_), onLoaded, true);
  };

  render = () => {
    const okButtonClicked = () => {
      const { object: mergeObject } = this.props;
      const { selected, descriptionOptions } = this.state;
      const mergeIds = selected.map((index) => descriptionOptions[index].id);
      const mergeKeys = filterFields(mergeObject._type_);
      const mergeFields = {};
      mergeKeys.forEach((key) => {
        const insertField = (field, mergeField) => {
          if (field !== null) {
            if (mergeField === null) {
              return [field];
            }
            if (!mergeField.includes(field)) {
              return mergeField.concat(field);
            }
          }
          return mergeField;
        };

        let mergeField = insertField(mergeObject[key], null);

        selected.forEach((index) => {
          mergeField = insertField(descriptionOptions[index][key], mergeField);
        });

        if (mergeField === null) {
          mergeFields[key] = null;
        } else {
          mergeFields[key] = mergeField.join('|');
        }
      });

      mergeKeys.forEach((key) => {
        mergeObject[key] = mergeFields[key];
      });

      if (selected.length > 0) {
        this.setState({
          selectedDone: true,
          mergeIds,
          mergeObject,
        });
      } else {
        this.setState({ error: 'make at least one merge selection' });
      }
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const onChange = (value) => {
      this.setState({ selected: value });
    };

    const { descriptionOptions, selectedDone, error } = this.state;
    const { object: { _type_ } } = this.props;
    const ShowObject = showObject(_type_);

    const options = descriptionOptions.map((val, index) => ({
      value: index,
      label: (<ShowObject object={val} mode="oneLine" />),
    }));

    const filterOptions = (inputValue, option) => {
      const object = descriptionOptions[option.value];

      return filterObject(object, inputValue);
    };

    if (selectedDone) {
      const { onOk, onCancel } = this.props;
      const { mergeObject, mergeIds } = this.state;
      const EditObject = editObject(mergeObject._type_);
      return (
        <EditObject
          object={mergeObject}
          onCancel={onCancel}
          onOk={onOk}
          extraData={{ merge_ids: mergeIds }}
        />
      );
    }

    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Select
                mode="multiple"
                autoClearSearchValue={false}
                style={{ width: '50ch' }}
                options={options}
                filterOption={filterOptions}
                onChange={onChange}
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
Merge.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
Merge.defaultProps = {
};

export default Merge;
