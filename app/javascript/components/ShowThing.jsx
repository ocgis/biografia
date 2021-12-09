import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Thing from './Thing';

const ShowThing = ({ match, location }) => (
  <Show
    showObject={Thing}
    _type_="Thing"
    match={match}
    location={location}
  />
);
ShowThing.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowThing;
