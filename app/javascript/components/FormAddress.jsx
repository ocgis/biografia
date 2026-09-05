import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { EnterOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  addressesFromPosition, addressResultName, addressResultKey, addressResultToAddressObject,
} from './Geocoding';

function PresentHint(props) {
  const { address, onSelect } = props;
  const hintText = addressResultName(address);
  return (
    <div>
      { hintText }
      <EnterOutlined onClick={() => onSelect(address)} />
    </div>
  );
}
PresentHint.propTypes = {
  address: PropTypes.shape().isRequired,
  onSelect: PropTypes.func.isRequired,
};

function PresentHints(props) {
  const { addresses, onSelect } = props;
  const hints = addresses.map((address) => (
    <PresentHint key={addressResultKey(address)} address={address} onSelect={onSelect} />
  ));
  return hints;
}
PresentHints.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function AddressHints(props) {
  let initHintsFetched = true;
  const { onSelect, referFrom } = props;
  if (referFrom != null) {
    if (referFrom.related != null) {
      if (referFrom.related.addresses.length > 0) {
        initHintsFetched = false;
      }
    }
  }

  const [hintsFetched, setHintsFetched] = useState(initHintsFetched);
  const [addresses, setAddresses] = useState([]);

  const loadHints = () => {
    referFrom.related.addresses.forEach((address) => {
      if ((address.latitude != null) && (address.longitude != null)) {
        addressesFromPosition(
          address.latitude,
          address.longitude,
          (a) => setAddresses(addresses.concat(a)),
        );
      }
    });
    setHintsFetched(true);
  };

  if (!hintsFetched) {
    return (
      <ReloadOutlined
        onClick={() => loadHints()}
      />
    );
  }

  return (
    <PresentHints addresses={addresses} onSelect={onSelect} />
  );
}
AddressHints.propTypes = {
  referFrom: PropTypes.shape(),
  onSelect: PropTypes.func.isRequired,
};
AddressHints.defaultProps = {
  referFrom: null,
};

function AddressFields(props) {
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
AddressFields.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
AddressFields.defaultProps = {
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

class FormAddress extends React.Component {
  constructor(props) {
    super(props);
    const { object: address } = props;
    this.state = { address };
  }

  componentDidUpdate(prevProps, _prevState) {
    const { object } = this.props;
    if (prevProps.object !== object) {
      this.setState({ address: object });
    }
  }

  render() {
    const { onChange, referFrom } = this.props;
    const { address } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td aria-label="address">
              <AddressFields
                onChange={onChange}
                object={address}
              />
            </td>
            <td aria-label="hints" valign="top">
              <AddressHints
                referFrom={referFrom}
                onSelect={(object) => {
                  const addressObject = addressResultToAddressObject(object);
                  onChange({
                    address: addressObject,
                  });
                  this.setState({
                    address: addressObject,
                  });
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
  referFrom: PropTypes.shape(),
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
  referFrom: null,
};

export default FormAddress;
