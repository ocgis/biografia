import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditAddress from './EditAddress';
import EmbeddedMap from './EmbeddedMap';
import { setMapping, webUrl } from './Mappings';

setMapping('Address', 'oneName', 'address');
setMapping('Address', 'manyName', 'addresses');
setMapping('Address', 'filterFields', ['street', 'town', 'zipcode', 'parish', 'country']);

const OneLine = (props) => {
  const { object: address } = props;

  const parts = [];

  if (address.street) {
    parts.push(address.street);
  }

  if (address.town && address.zipcode) {
    parts.push(`${address.zipcode} ${address.town}`);
  } else if (address.town) {
    parts.push(address.town);
  } else if (address.zipcode) {
    parts.push(address.zipcode);
  }

  if (address.parish) {
    parts.push(`${address.parish} församling`);
  }

  if (address.country) {
    parts.push(`${address.country}`);
  }

  if (parts.length === 0 && address.latitude && address.longitude) {
    parts.push(`${address.latitude},${address.longitude}`);
  }
  if (parts.length === 0) {
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
      editTitle="Ändra adress"
      modifierProps={{
        showMergeWith: true,
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

setMapping('Address', 'showObject', Address);

setMapping('Address', 'editObject', EditAddress);

const IndexAddress = () => (
  <Index
    _type_="Address"
  />
);

const ShowAddress = ({ match, location }) => (
  <Show
    _type_="Address"
    match={match}
    location={location}
  />
);
ShowAddress.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

const VersionAddress = ({ match, location }) => (
  <Version
    _type_="Address"
    match={match}
    location={location}
  />
);
VersionAddress.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export { IndexAddress, ShowAddress, VersionAddress };
