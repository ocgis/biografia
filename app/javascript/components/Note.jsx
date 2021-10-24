import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const Note = (props) => {
  const { object: note } = props;
  const { currentUser } = props;
  const { mode } = props;

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
        <Link to={`/r/notes/${note.id}`}>
          {note.title}
        </Link>
      );
    }
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {title}
            </td>
            <Modifier
              currentUser={currentUser}
              mainObject={{
                type_: 'Note',
                id: note.id,
              }}
            />
            <td>
              <VersionInfo object={note} />
            </td>
          </tr>
        </tbody>
      </table>
      <pre>
        {note.note}
      </pre>
    </div>
  );
};

Note.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Note.defaultProps = {
  mode: '',
};

export default Note;
