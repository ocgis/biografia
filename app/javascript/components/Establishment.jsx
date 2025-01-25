import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditEstablishment from './EditEstablishment';
import ListObjects from './ListObjects';
import { setMapping, webUrl } from './Mappings';

setMapping('Establishment', 'oneName', 'establishment');
setMapping('Establishment', 'manyName', 'establishments');
setMapping('Establishment', 'filterFields', ['name']);

const OneLine = (props) => {
  const { object: establishment } = props;

  const parts = [];

  if (establishment.name != null) {
    parts.push(establishment.name);
  }

  if (parts.length === 0) {
    parts.push('Okänt ställe');
  }

  return parts.join(', ');
};

function Establishment(props) {
  const {
    currentUser, mode, parent, object: establishment, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={establishment} />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Establishment', establishment.id)}>
        <OneLine object={establishment} />
      </Link>
    );
  }

  let element = null;
  if (mode === 'full') {
    element = [];
    if (establishment.name != null) {
      element.push(establishment.name);
      element.push(<br key="name" />);
    }
    if (establishment.kind != null) {
      element.push(establishment.kind);
      element.push(<br key="kind" />);
    }
    if (element.length === 0) {
      element.push('Okänt ställe');
    }
  } else {
    element = (
      <Link to={webUrl('Establishment', establishment.id)}>
        <OneLine object={establishment} />
      </Link>
    );
  }

  return (
    <Base
      parent={parent}
      object={establishment}
      editTitle="Ändra ställe"
      modifierProps={{
        showAddEvent: true,
        showAddPerson: true,
        showMergeWith: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {element}
    </Base>
  );
}

Establishment.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    kind: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Establishment.defaultProps = {
  parent: null,
  mode: '',
};

setMapping('Establishment', 'showObject', Establishment);

function ShowEstablishments(props) {
  const {
    mode, parent, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Establishment"
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowEstablishments.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowEstablishments.defaultProps = {
  mode: '',
  parent: null,
  objects: [],
};

setMapping('Establishment', 'showObjects', ShowEstablishments);

setMapping('Establishment', 'editObject', EditEstablishment);

function IndexEstablishment() {
  return (
    <Index
      _type_="Establishment"
    />
  );
}

function ShowEstablishment() {
  return (
    <Show
      _type_="Establishment"
    />
  );
}

function VersionEstablishment() {
  return (
    <Version
      _type_="Establishment"
    />
  );
}

export { IndexEstablishment, ShowEstablishment, VersionEstablishment };
