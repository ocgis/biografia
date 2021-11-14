import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import EditPerson from './EditPerson';

const OneLine = (props) => {
  const { object: { person_names: pns } } = props;

  const renderPersonName = (personName, index) => {
    if (personName.calling_name != null) {
      let parts = personName.given_name.split(personName.calling_name);
      for (let i = parts.length - 1; i > 0; i -= 1) {
        parts.splice(i, 0, <strong key={index}>{personName.calling_name}</strong>);
      }
      parts = parts.concat(` ${personName.surname}`);

      return parts;
    }
    return `${personName.given_name} ${personName.surname}`;
  };

  const personNames = pns.map((personName, i) => renderPersonName(personName, i));

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
        <Link to={`/r/people/${person.id}`}>
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
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
  reload: PropTypes.func.isRequired,
};

Person.defaultProps = {
  mode: '',
};

export default Person;
