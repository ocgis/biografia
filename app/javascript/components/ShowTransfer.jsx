import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Transfer from './Transfer';

const ShowTransfer = ({ match, location }) => (
  <Show
    showObject={Transfer}
    _type_="Transfer"
    match={match}
    location={location}
    noReferences
  />
);
ShowTransfer.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowTransfer;
