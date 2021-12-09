import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Medium from './Medium';

const ShowMedium = ({ match, location }) => (
  <Show
    showObject={Medium}
    _type_="Medium"
    match={match}
    location={location}
  />
);
ShowMedium.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowMedium;
