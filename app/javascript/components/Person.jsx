import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Modifier, VersionInfo } from './Common';
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

  if (mode === 'full') {
    const [modalIsVisible, modalSetVisible] = useState(false);
    const editPersonClicked = () => {
      modalSetVisible(true);
    };
    const okButtonClicked = () => {
      modalSetVisible(false);
      reload();
    };
    const cancelButtonClicked = () => {
      modalSetVisible(false);
    };

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <OneLine object={person} />
                {' '}
                {person.sex}
              </td>
              {
                currentUser.roles.includes('editor')
                && (
                  <td>
                    <EditOutlined onClick={editPersonClicked} />
                  </td>
                )
              }
              <Modifier
                currentUser={currentUser}
                mainObject={person}
                reload={reload}
                showAddEvent
              />
              <td>
                <VersionInfo object={person} />
              </td>
            </tr>
          </tbody>
        </table>
        {
          modalIsVisible && (
            <Modal
              title="Ändra person"
              visible
              closable={false}
              footer={null}
            >
              <EditPerson
                person={person}
                onOk={(response) => { okButtonClicked(response); }}
                onCancel={(response) => { cancelButtonClicked(response); }}
              />
            </Modal>
          )
        }
      </div>
    );
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <Link to={`/r/people/${person.id}`}>
              <OneLine object={person} />
            </Link>
            {' '}
            {person.sex}
          </td>
          <Modifier
            currentUser={currentUser}
            mainObject={person}
            reload={reload}
            showAddEvent
          />
          <td>
            <VersionInfo object={person} />
          </td>
        </tr>
      </tbody>
    </table>
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
