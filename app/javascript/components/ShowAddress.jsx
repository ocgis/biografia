import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Address from './Address';

const ShowAddress = ({ match, location }) => (
  <Show
    showObject={Address}
    _type_="Address"
    match={match}
    location={location}
  />
);
ShowAddress.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowAddress;
