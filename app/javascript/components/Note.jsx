import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const Note = (props) => {
  const { note } = props;
  const { currentUser } = props;
  const { showFull } = props;

  let title = null;
  if (note.title != null) {
    if (showFull) {
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
            <Modifier currentUser={currentUser} />
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
  note: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Note.defaultProps = {
  showFull: false,
};

export { Note };