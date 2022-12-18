import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Show from './Show';
import Version from './Version';
import EditNote from './EditNote';
import ListObjects from './ListObjects';
import { setMapping, webUrl } from './Mappings';

setMapping('Note', 'oneName', 'note');
setMapping('Note', 'manyName', 'notes');
setMapping('Note', 'filterFields', ['category', 'title', 'note']);

function Note(props) {
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
        showMergeWith: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {title}
    </Base>
  );
}

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

function ShowNotes(props) {
  const {
    mode, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Note"
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowNotes.propTypes = {
  mode: PropTypes.string,
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowNotes.defaultProps = {
  mode: '',
  objects: [],
};

setMapping('Note', 'showObjects', ShowNotes);

setMapping('Note', 'editObject', EditNote);

function ShowNote() {
  return (
    <Show
      _type_="Note"
    />
  );
}

function VersionNote() {
  return (
    <Version
      _type_="Note"
    />
  );
}

export { ShowNote, VersionNote };
