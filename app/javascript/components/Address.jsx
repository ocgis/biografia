import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import EditAddress from './EditAddress';
import EmbeddedMap from './EmbeddedMap';
import { webUrl } from './Mappings';

const OneLine = (props) => {
  const { object: address } = props;

  const parts = [];

  if (address.street != null) {
    parts.push(address.street);
  }

  if (address.town != null) {
    parts.push(address.town);
  }

  if (address.parish != null) {
    parts.push(`${address.parish} församling`);
  }

  if (parts.size === 0 && address.latitude != null && address.longitude != null) {
    parts.push(`${address.latitude},${address.longitude}`);
  }
  if (parts.size === 0) {
    return 'Empty address';
  }

  return parts.join(', ');
};

const Address = (props) => {
  const {
    currentUser, mode, object: address, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={address} />
    );
  }

  let name = null;
  if (mode === 'full') {
    if (address.maps_address == null) {
      name = (
        <OneLine object={address} />
      );
    } else {
      name = (
        <div>
          <OneLine object={address} />
          <br />
          <EmbeddedMap location={address.maps_address} />
        </div>
      );
    }
  } else {
    name = (
      <Link to={webUrl('Address', address.id)}>
        <OneLine object={address} />
      </Link>
    );
  }
  return (
    <Base
      object={address}
      editComponent={EditAddress}
      editTitle="Ändra adress"
      modifierProps={{
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {name}
    </Base>
  );
};

Address.propTypes = {
  object: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Address.defaultProps = {
  mode: '',
};

export default Address;
