import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const Medium = (props) => {
  const { object: medium } = props;
  const { currentUser } = props;
  const { showFull } = props;

  let mediaTag = null;

  if (showFull) {
    mediaTag = (
      <img src={`/media/${medium.id}/image`} alt={medium.file_name} />
    );
  } else {
    mediaTag = (
      <Link to={`/r/media/${medium.id}`}>
        <img src={`/media/${medium.id}/thumb`} alt={medium.file_name} />
      </Link>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={medium} />
            </td>
          </tr>
        </tbody>
      </table>
      {mediaTag}
      <br />
    </div>
  );
};

Medium.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Medium.defaultProps = {
  showFull: false,
};

export { Medium as default, Medium };
