import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Show from './Show';
import Version from './Version';
import EditRelationship from './EditRelationship';
import {
  setMapping, showObject, manyName, webUrl,
} from './Mappings';

setMapping('Relationship', 'oneName', 'relationship');
setMapping('Relationship', 'manyName', 'relationships');

const ListObjects = (props) => {
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
        />
        {' '}
      </Link>
    </li>
  ));

  return (
    <ul>
      {parts}
    </ul>
  );
};

ListObjects.propTypes = {
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

const Relationship = (props) => {
  const {
    currentUser, mode, object: relationship, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={relationship} />
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
      <ListObjects
        object={relationship}
        relatedType="Person"
        currentUser={currentUser}
        reload={reload}
      />
      <ListObjects
        object={relationship}
        relatedType="EventDate"
        currentUser={currentUser}
        reload={reload}
      />
      <ListObjects
        object={relationship}
        relatedType="Address"
        currentUser={currentUser}
        reload={reload}
      />
      <ListObjects
        object={relationship}
        relatedType="Note"
        currentUser={currentUser}
        reload={reload}
      />
    </div>
  );

  return (
    <Base
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
};

Relationship.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Relationship.defaultProps = {
  mode: '',
};

setMapping('Relationship', 'showObject', Relationship);

setMapping('Relationship', 'editObject', EditRelationship);

const ShowRelationship = () => (
  <Show
    _type_="Relationship"
  />
);

const VersionRelationship = () => (
  <Version
    _type_="Relationship"
  />
);

export { ShowRelationship, VersionRelationship };
