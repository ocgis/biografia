import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';
import { oneName, manyName, showObject } from './Mappings';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    const { extraData, _type_ } = props;
    this.state = {};
    if (extraData != null) {
      this.state = extraData;
    }

    const { reference, referFrom } = this.state;
    if (reference != null) {
      this.state.reference = { ...reference };
    } else if (referFrom != null) {
      this.state.reference = {
        name: _type_,
        id1: referFrom.id,
        type1: referFrom._type_,
      };
    }
  }

  render() {
    const handleReferenceSaveResult = (result) => {
      const { onOk } = this.props;
      if (result.error == null) {
        onOk(result);
      } else {
        this.setState({ error: result.error });
      }
    };

    const handleObjectSaveResult = (result) => {
      if (result.error == null) {
        const { reference } = this.state;
        if (reference != null) {
          const { _type_ } = this.props;
          if (oneName(_type_) in result) {
            reference.id2 = result[oneName(_type_)].id;
            reference.type2 = _type_;
            saveData('Reference', this.state, handleReferenceSaveResult);
          } else {
            const objects = result[manyName(_type_)];
            const references = objects.map((object) => ({
              ...reference,
              id2: object.id,
              type2: _type_,
            }));
            saveData('Reference', { references }, handleReferenceSaveResult);
          }
        } else {
          const { onOk } = this.props;
          onOk(result);
        }
      } else {
        this.setState({ error: result.error });
      }
    };

    const okButtonClicked = () => {
      const { _type_ } = this.props;
      saveData(_type_, this.state, handleObjectSaveResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const onChange = (data) => {
      this.setState(data);
    };

    const { object, formObject: FormObject } = this.props;
    const { error, reference, referFrom } = this.state;

    let referenceElement = null;
    if (referFrom != null) {
      const ShowObject = showObject(referFrom._type_);
      referenceElement = (
        <>
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
                    defaultValue={reference.name}
                    onChange={(event) => {
                      reference.name = event.target.value;
                      // onChange({ note });
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
        </>
      );
    }

    return (
      <div>
        { referenceElement }
        <FormObject object={object} onChange={onChange} />
        <CheckOutlined onClick={okButtonClicked} />
        <CloseOutlined onClick={closeButtonClicked} />
        { error }
      </div>
    );
  }
}
Edit.propTypes = {
  _type_: PropTypes.string.isRequired,
  formObject: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
Edit.defaultProps = {
  object: undefined,
  extraData: null,
};

export default Edit;
