import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import {
  setMapping, showObject, showObjects, webUrl,
} from './Mappings';

setMapping('Reference', 'oneName', 'reference');
setMapping('Reference', 'manyName', 'references');

const { TabPane } = Tabs;

function RenderElement(props) {
  const {
    currentUser, element, kind, reload,
  } = props;

  const Component = showObject(kind);

  if (Component == null) {
    return null;
  }

  return (
    <Component object={element} currentUser={currentUser} reload={reload} />
  );
}

RenderElement.propTypes = {
  kind: PropTypes.string.isRequired,
  element: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
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

function FamilyMembers(props) {
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

FamilyMembers.propTypes = {
  object: PropTypes.shape().isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

function ShowReferences(props) {
  const {
    currentUser, object, object: { related }, reload,
  } = props;
  const tabHeader = (key) => {
    const header = {
      people: 'Personer',
      events: 'Händelser',
      event_dates: 'Datum',
      notes: 'Kommentarer',
      relationships: 'Förhållanden',
      media: 'Media',
      addresses: 'Adresser',
      things: 'Saker',
    }[key];
    if (header == null) {
      return `Undefined: ${key}`;
    }
    return header;
  };

  return (
    <Tabs>
      { object._type_ === 'Person'
        && (
          <TabPane tab="Familjemedlemmar" key="familyMembers">
            <FamilyMembers
              object={object}
              currentUser={currentUser}
            />
          </TabPane>
        )}
      {Object.keys(related).map((key) => {
        if (related[key].length > 0) {
          const ShowObjects = showObjects(key);

          return (
            <TabPane tab={tabHeader(key)} key={key}>
              <ShowObjects
                objects={related[key]}
                reload={reload}
                currentUser={currentUser}
              />
            </TabPane>
          );
        }
        return null;
      })}
    </Tabs>
  );
}

ShowReferences.propTypes = {
  object: PropTypes.shape().isRequired,
  /* related: PropTypes.shape({
   *   notes: PropTypes.arrayOf(PropTypes.shape({})),
   * }).isRequired, */
  reload: PropTypes.func,
  currentUser: PropTypes.shape({}).isRequired,
};
ShowReferences.defaultProps = {
  reload: () => alert('Missing reload callback'),
};

/* eslint-disable import/prefer-default-export */
export { ShowReferences };
