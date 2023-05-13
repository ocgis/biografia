import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormAddress extends React.Component {
  constructor(props) {
    super(props);

    const { object: address } = props;
    this.state = { address: JSON.parse(JSON.stringify(address)) };
  }

  componentDidMount() {
    const { onChange } = this.props;
    const { address } = this.state;
    onChange({ address });
  }

  render() {
    const { onChange } = this.props;
    const { address } = this.state;

    return (
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
                  onChange({ address });
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
                  onChange({ address });
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
                  onChange({ address });
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
                  onChange({ address });
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
                  onChange({ address });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Latitud:
            </td>
            <td>
              <Input
                defaultValue={address.latitude}
                onChange={(event) => {
                  address.latitude = event.target.value;
                  onChange({ address });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Longitud:
            </td>
            <td>
              <Input
                defaultValue={address.longitude}
                onChange={(event) => {
                  address.longitude = event.target.value;
                  onChange({ address });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Källa:
            </td>
            <td>
              <Input
                defaultValue={address.source}
                onChange={(event) => {
                  address.source = event.target.value;
                  onChange({ address });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormAddress.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormAddress.defaultProps = {
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
};

export default FormAddress;
