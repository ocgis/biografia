import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';
import Person from './Person';
import EventDate from './EventDate';
import Address from './Address';
import Note from './Note';

const ListObjects = (props) => {
  const { object } = props;
  const { relatedName } = props;
  const { output: Output } = props;
  const { currentUser } = props;
  const relObjs = object.related[relatedName];

  if (relObjs.length === 0) {
    return null;
  }

  const parts = relObjs.map((relObj) => (
    <li key={relObj.id}>
      <Link to={`/r/${relatedName}/${relObj.id}`} key={relObj.id}>
        <Output object={relObj} currentUser={currentUser} />
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
  relatedName: PropTypes.string.isRequired,
  output: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

const OneLine = (props) => {
  const { object: relationship } = props;
  const { object: { related: { people } } } = props;

  const parts = [];

  if (relationship.name == null || relationship.name === '') {
    parts.push('Familj');
  } else {
    parts.push(relationship.name);
  }

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

  return parts;
};

const Relationship = (props) => {
  const { object: relationship } = props;
  const { currentUser } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={relationship} />
    );
  }

  if (mode === 'full') {
    return 'Implement relationship show full';
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <Link to={`/r/relationships/${relationship.id}`}>
                <OneLine object={relationship} />
              </Link>
            </td>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={relationship} />
            </td>
          </tr>
        </tbody>
      </table>
      <ListObjects object={relationship} relatedName="people" output={Person} currentUser={currentUser} />
      <ListObjects object={relationship} relatedName="event_dates" output={EventDate} currentUser={currentUser} />
      <ListObjects object={relationship} relatedName="addresses" output={Address} currentUser={currentUser} />
      <ListObjects object={relationship} relatedName="notes" output={Note} currentUser={currentUser} />
    </div>
  );
};

Relationship.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Relationship.defaultProps = {
  mode: '',
};

export default Relationship;
