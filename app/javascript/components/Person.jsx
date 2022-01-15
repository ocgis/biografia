import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import EditPerson from './EditPerson';
import { setMapping, webUrl } from './Mappings';

setMapping('Person', 'oneName', 'person');
setMapping('Person', 'manyName', 'people');

const OneLine = (props) => {
  const { object: { person_names: pns } } = props;

  const renderPersonName = (personName) => {
    if (personName.calling_name != null) {
      let parts = personName.given_name.split(/( )/g).map((s) => {
        if (s === personName.calling_name) {
          return (
            <strong key={personName.id}>
              {personName.calling_name}
            </strong>
          );
        }
        return s;
      });
      parts = parts.concat(` ${personName.surname}`);

      return parts;
    }
    return `${personName.given_name} ${personName.surname}`;
  };

  const personNames = pns.map((personName) => renderPersonName(personName));

  if (personNames.length === 1) {
    return personNames[0];
  }
  if (personNames.length > 1) {
    let result = [].concat(personNames[personNames.length - 1]);
    result.push(' (');
    result = result.concat(personNames[0]);
    for (let i = 1; i < personNames.length - 1; i += 1) {
      result.push(', ');
      result = result.concat(personNames[i]);
    }
    result.push(')');
    return result;
  }
  return '!!!Error in DB: person name missing!!!';
};

const Person = (props) => {
  const {
    object: person,
    currentUser,
    mode,
    reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={person} />
    );
  }

  let personElements = null;

  if (mode === 'full') {
    personElements = (
      <div>
        <OneLine object={person} />
        {' '}
        {person.sex}
      </div>
    );
  } else {
    personElements = (
      <div>
        <Link to={webUrl('Person', person.id)}>
          <OneLine object={person} />
        </Link>
        {' '}
        {person.sex}
      </div>
    );
  }

  return (
    <Base
      object={person}
      editComponent={EditPerson}
      editTitle="Ändra person"
      modifierProps={{
        showAddAddress: true,
        showAddEvent: true,
        showAddNote: true,
        showAddRelationship: true,
        showAddThing: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {personElements}
    </Base>
  );
};

Person.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    person_names: PropTypes.arrayOf(PropTypes.shape({})),
    sex: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  mode: PropTypes.string,
  reload: PropTypes.func.isRequired,
};

Person.defaultProps = {
  mode: '',
};

export default Person;
