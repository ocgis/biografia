import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import {
  CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined,
} from '@ant-design/icons';
import { Modifier, VersionInfo } from './Common';

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
    onEdit,
    onSave,
    onCancel,
    updateState,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={person} />
    );
  }

  if (mode === 'full') {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <OneLine object={person} />
              {' '}
              {person.sex}
            </td>
            <td>
              <EditOutlined onClick={onEdit} />
            </td>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={person} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (mode === 'edit') {
    const renderPersonName = (pn, setProperty) => {
      if (pn._destroy) {
        return null;
      }
      return (
        <tr key={pn.id}>
          <td>
            <Input
              defaultValue={pn.given_name}
              onChange={(event) => setProperty('given_name', event.target.value)}
            />
          </td>
          <td>
            <Input
              defaultValue={pn.calling_name}
              onChange={(event) => setProperty('calling_name', event.target.value)}
            />
          </td>
          <td>
            <Input
              defaultValue={pn.surname}
              onChange={(event) => setProperty('surname', event.target.value)}
            />
          </td>
          <td>
            <CloseOutlined
              onClick={() => {
                setProperty('_destroy', true);
                updateState({ person });
              }}
            />
          </td>
        </tr>
      );
    };

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>
                Förnamn
              </th>
              <th>
                Tilltalsnamn
              </th>
              <th>
                Efternamn
              </th>
            </tr>
          </thead>
          <tbody>
            {person.person_names.map((pn, index) => renderPersonName(pn, (property, value) => {
              person.person_names[index][property] = value;
            }))}
          </tbody>
        </table>
        <PlusOutlined
          onClick={() => {
            person.person_names.push({
              given_name: null,
              calling_name: null,
              surname: null,
            });
            updateState({ person });
          }}
        />
        <table>
          <tbody>
            <tr>
              <td>
                Kön:
              </td>
              <td>
                <Input
                  defaultValue={person.sex}
                  onChange={(event) => {
                    person.sex = event.target.value;
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <CheckOutlined onClick={onSave} />
        <CloseOutlined onClick={onCancel} />
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
          <Modifier currentUser={currentUser} />
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
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  updateState: PropTypes.func,
};

Person.defaultProps = {
  mode: '',
  onEdit: null,
  onSave: null,
  onCancel: null,
  updateState: null,
};

export default Person;
