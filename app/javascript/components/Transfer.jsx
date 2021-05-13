import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OneLine = (props) => {
  const { object: transfer } = props;

  return transfer.file_name;
};

const Transfer = (props) => {
  const { object: transfer } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={transfer} />
    );
  }

  let element = null;
  if (mode === 'full') {
    element = (
      <div>
        <h1>
          {'Transferred file: '}
          {transfer.file_name}
        </h1>
        <table>
          <tbody>
            <tr>
              <td>File name:</td>
              <td>{transfer.file_name}</td>
            </tr>
            <tr>
              <td>File type:</td>
              <td>{transfer.content_type}</td>
            </tr>
            <tr>
              <td>Created at:</td>
              <td>{transfer.created_at}</td>
            </tr>
          </tbody>
        </table>

        <Link to={`/r/imports/new?transfer_id=${transfer.id}`}>
          Import this file
        </Link>
      </div>
    );
  } else {
    element = 'Implement limited display of transfers';
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {element}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Transfer.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Transfer.defaultProps = {
  mode: '',
};

export default Transfer;