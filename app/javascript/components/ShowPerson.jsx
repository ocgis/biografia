import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Person from './Person';

const ShowPerson = ({ match, location }) => (
  <Show
    showObject={Person}
    _type_="Person"
    match={match}
    location={location}
  />
);
ShowPerson.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowPerson;
