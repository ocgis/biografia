import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Show from './Show';
import Version from './Version';
import EditRelationship from './EditRelationship';
import ListObjects from './ListObjects';
import {
  setMapping, showObject, manyName, webUrl,
} from './Mappings';

setMapping('Relationship', 'oneName', 'relationship');
setMapping('Relationship', 'manyName', 'relationships');

function ListRelated(props) {
  const { object } = props;

  if (object.related == null) {
    return null;
  }

  const { relatedType } = props;
  const Output = showObject(relatedType);
  const { currentUser } = props;
  const { reload } = props;
  const relObjs = object.related[manyName(relatedType)];

  if (relObjs.length === 0) {
    return null;
  }

  const parts = relObjs.map((relObj) => (
    <li key={relObj.id}>
      <Link to={webUrl(relatedType, relObj.id)} key={relObj.id}>
        <Output
          object={relObj}
          currentUser={currentUser}
          reload={reload}
          mode="oneLine"
        />
      </Link>
    </li>
  ));

  return (
    <ul>
      {parts}
    </ul>
  );
}

ListRelated.propTypes = {
  object: PropTypes.shape({ related: PropTypes.shape({}) }).isRequired,
  relatedType: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
};

const OneLine = (props) => {
  const { object: relationship } = props;
  const { object: { related } } = props;

  const parts = [];

  if (relationship.name == null || relationship.name === '') {
    parts.push('Familj');
  } else {
    parts.push(relationship.name);
  }

  if (related != null) {
    const { people } = related;

    if (people.length === 1) {
      parts.push(` bestående av ${people[0].name}`);
    } else if (people.length === 2) {
      parts.push(` bestående av ${people[0].name} och ${people[1].name}`);
    } else if (people.length === 3) {
      parts.push(` bestående av ${people[0].name}, ${people[1].name} och en person till`);
    } else if (people.length > 3) {
      const extraPeople = people.length - 2;
      parts.push(` bestående av ${people[0].name}, ${people[1].name} och ${extraPeople} personer till`);
    }
  }

  return parts;
};

function Relationship(props) {
  const {
    currentUser, mode, parent, object: relationship, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={relationship} />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Relationship', relationship.id)}>
        <OneLine object={relationship} />
      </Link>
    );
  }

  let element = null;
  if (mode === 'full') {
    element = (
      <OneLine object={relationship} />
    );
  } else {
    element = (
      <Link to={webUrl('Relationship', relationship.id)}>
        <OneLine object={relationship} />
      </Link>
    );
  }

  const appendElements = (
    <div>
      <ListRelated
        object={relationship}
        relatedType="Person"
        currentUser={currentUser}
        reload={reload}
      />
      <ListRelated
        object={relationship}
        relatedType="EventDate"
        currentUser={currentUser}
        reload={reload}
      />
      <ListRelated
        object={relationship}
        relatedType="Address"
        currentUser={currentUser}
        reload={reload}
      />
      <ListRelated
        object={relationship}
        relatedType="Note"
        currentUser={currentUser}
        reload={reload}
      />
    </div>
  );

  return (
    <Base
      parent={parent}
      object={relationship}
      appendElements={appendElements}
      editTitle="Ändra förhållande"
      modifierProps={{
        showAddEvent: true,
        showAddNote: true,
        showAddPerson: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {element}
    </Base>
  );
}

Relationship.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({}),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

Relationship.defaultProps = {
  parent: null,
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('Relationship', 'showObject', Relationship);

function ShowRelationships(props) {
  const {
    mode, parent, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Relationship"
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowRelationships.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowRelationships.defaultProps = {
  mode: '',
  parent: null,
  objects: [],
};

setMapping('Relationship', 'showObjects', ShowRelationships);

setMapping('Relationship', 'editObject', EditRelationship);

function ShowRelationship() {
  return (
    <Show
      _type_="Relationship"
    />
  );
}

function VersionRelationship() {
  return (
    <Version
      _type_="Relationship"
    />
  );
}

export { ShowRelationship, VersionRelationship };
