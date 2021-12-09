import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import User from './User';

const ShowUser = ({ match, location }) => (
  <Show
    showObject={User}
    _type_="User"
    match={match}
    location={location}
    noReferences
  />
);
ShowUser.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowUser;
