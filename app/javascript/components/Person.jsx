import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Base from './Base';
import Show from './Show';
import Index from './Index';
import Version from './Version';
import EditPerson from './EditPerson';
import ListObjects from './ListObjects';
import { setMapping, showObject, webUrl } from './Mappings';

setMapping('Person', 'oneName', 'person');
setMapping('Person', 'manyName', 'people');
setMapping('Person', 'filterFields', [{ person_names: ['given_name', 'surname'] }]);

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

const FamilyRole = (familyRefName, personRefName, personSex) => {
  switch (familyRefName) {
    case 'Child':
      switch (personRefName) {
        case 'Child':
          switch (personSex) {
            case 'M':
              return 'Bror';
            case 'F':
              return 'Syster';
            default:
              return 'Syskon';
          }
        case 'Spouse':
          switch (personSex) {
            case 'M':
              return 'Far';
            case 'F':
              return 'Mor';
            default:
              return 'Förälder';
          }
        default:
      }
      break;
    case 'Spouse':
      switch (personRefName) {
        case 'Child':
          switch (personSex) {
            case 'M':
              return 'Son';
            case 'F':
              return 'Dotter';
            default:
              return 'Barn';
          }
        case 'Spouse':
          switch (personSex) {
            case 'M':
              return 'Make';
            case 'F':
              return 'Maka';
            default:
              return 'Partner';
          }
        default:
      }
      break;
    default:
  }
  return 'Okänd roll';
};

function Overview(props) {
  const {
    object, object: { related: { relationships } }, currentUser,
  } = props;
  const rows = [];
  const ShowObject = showObject('Person');
  relationships.forEach((relationship) => {
    const { reference: { name: familyRefName } } = relationship;

    const { related: { people } } = relationship;
    people.forEach((person) => {
      if (object.id !== person.id) {
        const { reference: { name: personRefName }, sex: personSex } = person;

        const familyRole = FamilyRole(familyRefName, personRefName, personSex);
        rows.push((
          <tr key={person.id}>
            <td>
              <Link to={webUrl(person._type_, person.id)}>
                <ShowObject
                  object={person}
                  mode="oneLine"
                  currentUser={currentUser}
                  reload={() => alert('Unexpected: Implement reload() for FamilyMembers()')}
                />
              </Link>
            </td>
            <td>{familyRole}</td>
          </tr>
        ));
      }
    });
  });
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

Overview.propTypes = {
  object: PropTypes.shape().isRequired,
  currentUser: PropTypes.shape({}),
};

Overview.defaultProps = {
  currentUser: null,
};

function Person(props) {
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

  if (mode === 'overview') {
    return (
      <Overview
        object={person}
        currentUser={currentUser}
      />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Person', person.id)}>
        <OneLine object={person} />
      </Link>
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
      editTitle="Ändra person"
      modifierProps={{
        showAddAddress: true,
        showAddEvent: true,
        showAddNote: true,
        showAddRelationship: true,
        showAddThing: true,
        showMergeWith: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {personElements}
    </Base>
  );
}

Person.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    person_names: PropTypes.arrayOf(PropTypes.shape({})),
    sex: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  mode: PropTypes.string,
  reload: PropTypes.func,
};

Person.defaultProps = {
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('Person', 'showObject', Person);

function ShowPeople(props) {
  const {
    mode, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Person"
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowPeople.propTypes = {
  mode: PropTypes.string,
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowPeople.defaultProps = {
  mode: '',
  objects: [],
};

setMapping('Person', 'showObjects', ShowPeople);

setMapping('Person', 'editObject', EditPerson);

function ShowPerson() {
  return (
    <Show
      _type_="Person"
    />
  );
}

function IndexPerson() {
  return (
    <Index
      _type_="Person"
    />
  );
}

function VersionPerson() {
  return (
    <Version
      _type_="Person"
    />
  );
}

export { ShowPerson, IndexPerson, VersionPerson };
