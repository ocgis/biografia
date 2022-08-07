import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Index from './Index';
import Show from './Show';
import { setMapping, webUrl } from './Mappings';

setMapping('User', 'oneName', 'user');
setMapping('User', 'manyName', 'users');

const OneLine = (props) => {
  const { object } = props;

  return `${object.name}`;
};

const ShowRoles = (props) => {
  const { roles } = props;

  const roleList = Object.keys(roles).map((role) => (
    <tr key={role}>
      <td>
        <b>{role}</b>
      </td>
      <td>
        {roles[role] ? 'Ja' : 'Nej'}
      </td>
    </tr>
  ));

  return (
    <table>
      <tbody>
        {roleList}
      </tbody>
    </table>
  );
};
ShowRoles.propTypes = {
  roles: PropTypes.shape({}).isRequired,
};

const User = (props) => {
  const { object } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={object} />
    );
  }

  let element = null;
  if (mode === 'full') {
    element = object.name;
  } else {
    element = 'Implement limited display of users';
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td><b>Användarid:</b></td>
            <td>{object.uid}</td>
          </tr>
          <tr>
            <td><b>Namn:</b></td>
            <td>{ element }</td>
          </tr>
          <tr>
            <td><b>Roller:</b></td>
            <td><ShowRoles roles={object.roles} /></td>
          </tr>
          <tr>
            <td><b>Hemobjekt:</b></td>
            <td>{object.home_object_name}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <Link to={webUrl('User', object.id, 'edit')}>Ändra</Link>
    </div>
  );
};

User.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    uid: PropTypes.string,
    roles: PropTypes.shape({}),
    home_object_name: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

User.defaultProps = {
  mode: '',
};

setMapping('User', 'showObject', User);

const IndexUser = () => (
  <Index
    _type_="User"
  />
);

const ShowUser = () => (
  <Show
    _type_="User"
    noReferences
  />
);

export { IndexUser, ShowUser };
