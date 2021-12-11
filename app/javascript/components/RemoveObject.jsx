import React from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { removeData } from './Requests';
import { oneName } from './Mappings';

class RemoveObject extends React.Component {
  constructor(props) {
    super(props);
    const { _type_ } = props.object;
    this.state = {};
    this.state[oneName(_type_)] = props.object;
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
      const { object: { _type_ } } = this.props;
      removeData(_type_, this.state, handleResult);
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
              Skall objektet tas bort?
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
RemoveObject.propTypes = {
  object: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
RemoveObject.defaultProps = {
};

export default RemoveObject;
