import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditAddress from './EditAddress';
import EmbeddedMap from './EmbeddedMap';
import ListObjects from './ListObjects';
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

function Address(props) {
  const {
    parent, currentUser, mode, object: address, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={address} />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Address', address.id)}>
        <OneLine object={address} />
      </Link>
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
      parent={parent}
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
}

Address.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
    maps_address: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

Address.defaultProps = {
  parent: null,
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('Address', 'showObject', Address);

function ShowAddresses(props) {
  const {
    mode, parent, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Address"
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowAddresses.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowAddresses.defaultProps = {
  parent: null,
  mode: '',
  objects: [],
};

setMapping('Address', 'showObjects', ShowAddresses);

setMapping('Address', 'editObject', EditAddress);

function IndexAddress() {
  return (
    <Index
      _type_="Address"
    />
  );
}

function ShowAddress() {
  return (
    <Show
      _type_="Address"
    />
  );
}

function VersionAddress() {
  return (
    <Version
      _type_="Address"
    />
  );
}

export { IndexAddress, ShowAddress, VersionAddress };
