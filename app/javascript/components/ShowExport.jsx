import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Export from './Export';

const ShowExport = ({ match, location }) => (
  <Show
    showObject={Export}
    _type_="Export"
    match={match}
    location={location}
    noReferences
  />
);
ShowExport.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowExport;
