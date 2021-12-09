import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Relationship from './Relationship';

const ShowRelationship = ({ match, location }) => (
  <Show
    showObject={Relationship}
    _type_="Relationship"
    match={match}
    location={location}
  />
);
ShowRelationship.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowRelationship;
