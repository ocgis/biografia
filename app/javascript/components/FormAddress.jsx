import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

function FormAddress(props) {
  const { onChange, object: address } = props;

  return (
    <table>
      <tbody>
        <tr>
          <td>
            Gata:
          </td>
          <td aria-label="street">
            <Input
              value={address.street}
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
          <td aria-label="town">
            <Input
              value={address.town}
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
          <td aria-label="zipcode">
            <Input
              value={address.zipcode}
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
          <td aria-label="parish">
            <Input
              value={address.parish}
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
          <td aria-label="country">
            <Input
              value={address.country}
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
          <td aria-label="latitude">
            <Input
              value={address.latitude}
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
          <td aria-label="longitude">
            <Input
              value={address.longitude}
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
          <td aria-label="source">
            <Input
              value={address.source}
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
