import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import EventDate from './EventDate';

const ShowEventDate = ({ match, location }) => (
  <Show
    showObject={EventDate}
    _type_="EventDate"
    match={match}
    location={location}
  />
);
ShowEventDate.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowEventDate;
