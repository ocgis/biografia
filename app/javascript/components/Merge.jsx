import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
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

  render() {
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

    const selectIdentical = () => {
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

      const { object } = this.props;
      const { descriptionOptions, selected } = this.state;
      const {
        id, created_at, updated_at, reference: ref_, _type_, related, source, ...strippedItem
      } = object;
      const newSelected = [...selected];

      descriptionOptions.forEach((o, index) => {
        if (itemMatches(strippedItem, o)) {
          if (!newSelected.includes(index)) {
            newSelected.push(index);
          }
        }
      });

      this.setState({ selected: newSelected });
    };

    const {
      descriptionOptions, selectedDone, selected, error,
    } = this.state;
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
                value={selected}
                mode="multiple"
                autoClearSearchValue={false}
                style={{ width: '50ch' }}
                options={options}
                filterOption={filterOptions}
                onChange={onChange}
              />
            </td>
            <td>
              <Button
                onClick={selectIdentical}
              >
                Markera identiska
              </Button>
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
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    reference: PropTypes.shape(),
    related: PropTypes.shape(),
    source: PropTypes.string,
  }).isRequired,
};
Merge.defaultProps = {
};

export default Merge;
