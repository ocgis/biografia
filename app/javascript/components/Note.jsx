import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Show from './Show';
import EditNote from './EditNote';
import { setMapping, webUrl } from './Mappings';

setMapping('Note', 'oneName', 'note');
setMapping('Note', 'manyName', 'notes');

const Note = (props) => {
  const {
    currentUser, mode, object: note, reload,
  } = props;

  if (mode === 'oneLine') {
    if (note.title == null) {
      return 'Utan rubrik';
    }
    return note.title;
  }

  let title = null;
  if (note.title != null) {
    if (mode === 'full') {
      title = note.title;
    } else {
      title = (
        <Link to={webUrl('Note', note.id)}>
          {note.title}
        </Link>
      );
    }
  }

  const appendElements = (
    <pre>
      {note.note}
    </pre>
  );

  return (
    <Base
      object={note}
      appendElements={appendElements}
      editTitle="Ändra kommentar"
      modifierProps={{
        showAddPerson: true,
        showAddEventDate: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {title}
    </Base>
  );
};

Note.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Note.defaultProps = {
  mode: '',
};

setMapping('Note', 'showObject', Note);

setMapping('Note', 'editObject', EditNote);

const ShowNote = ({ match, location }) => (
  <Show
    _type_="Note"
    match={match}
    location={location}
  />
);
ShowNote.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

/* eslint-disable import/prefer-default-export */
export { ShowNote };
