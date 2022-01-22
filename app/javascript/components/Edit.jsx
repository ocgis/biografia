import React from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class Edit extends React.Component {
  constructor(props) {
    super(props);

    const { extraData } = props;
    this.state = {};
    if (extraData != null) {
      this.state = extraData;
    }
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
      const { _type_ } = this.props;
      saveData(_type_, this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const onChange = (data) => {
      this.setState(data);
    };

    const { object, formObject: FormObject } = this.props;
    const { error } = this.state;

    return (
      <div>
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
