import React from 'react';
import PropTypes from 'prop-types';
import Show from './Show';
import Note from './Note';

const ShowNote = ({ match, location }) => (
  <Show
    showObject={Note}
    _type_="Note"
    match={match}
    location={location}
  />
);
ShowNote.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default ShowNote;
