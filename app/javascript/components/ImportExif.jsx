import React from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { errorText, postRequest } from './Requests';
import { apiUrl } from './Mappings';

class ImportExif extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    const handleResponse = (result) => {
      const { onOk } = this.props;
      onOk(result);
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };

    const okButtonClicked = () => {
      const { referFrom } = this.props;
      const url = apiUrl(referFrom._type_, referFrom.id, 'import_exif');
      postRequest(url, {}, handleResponse, handleError);
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
              Skall EXIF importeras?
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
ImportExif.propTypes = {
  referFrom: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
ImportExif.defaultProps = {
};

export default ImportExif;
