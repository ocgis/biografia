import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Event from './Event';

const ShowEvent = ({ match, location }) => (
  <Show
    showObject={Event}
    _type_="Event"
    match={match}
    location={location}
  />
);
ShowEvent.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowEvent;
