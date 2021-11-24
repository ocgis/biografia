import React from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Remove from './Remove';

class RemoveReference extends Remove {
  constructor(props) {
    super(props, 'Reference');
    this.state = { reference: this.props.reference };
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
      this.removeData(handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { error } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Skall referensen tas bort?
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
RemoveReference.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  reference: PropTypes.shape({}).isRequired,
};
RemoveReference.defaultProps = {
};

export default RemoveReference;
