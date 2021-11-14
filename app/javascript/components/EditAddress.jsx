import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SaveData from './SaveData';

class EditAddress extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'address';
    this.apiUrl = '/api/v1/addresses';

    const { object: address, referFrom } = props;
    this.state = { address: JSON.parse(JSON.stringify(address)) };
    if (referFrom != null) {
      this.state.referFrom = {
        type_: referFrom.type_,
        id: referFrom.id,
      };
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
      this.saveData(handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { address, error } = this.state;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Gata:
              </td>
              <td>
                <Input
                  defaultValue={address.street}
                  onChange={(event) => {
                    address.street = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Postort:
              </td>
              <td>
                <Input
                  defaultValue={address.town}
                  onChange={(event) => {
                    address.town = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Postnummer:
              </td>
              <td>
                <Input
                  defaultValue={address.zipcode}
                  onChange={(event) => {
                    address.zipcode = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Församling:
              </td>
              <td>
                <Input
                  defaultValue={address.parish}
                  onChange={(event) => {
                    address.parish = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Land:
              </td>
              <td>
                <Input
                  defaultValue={address.country}
                  onChange={(event) => {
                    address.country = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Latitude:
              </td>
              <td>
                <Input
                  defaultValue={address.latitude}
                  onChange={(event) => {
                    address.latitude = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Longitude:
              </td>
              <td>
                <Input
                  defaultValue={address.longitude}
                  onChange={(event) => {
                    address.longitude = event.target.value;
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <CheckOutlined onClick={okButtonClicked} />
        <CloseOutlined onClick={closeButtonClicked} />
        { error }
      </div>
    );
  }
}
EditAddress.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditAddress.defaultProps = {
  object: {
    street: null,
    town: null,
    zipcode: null,
    parish: null,
    country: null,
    latitude: null,
    longitude: null,
    source: null,
  },
  referFrom: null,
};

export default EditAddress;
