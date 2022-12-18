import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Index from './Index';
import Show from './Show';
import ListObjects from './ListObjects';
import { setMapping, webUrl } from './Mappings';

setMapping('Transfer', 'oneName', 'transfer');
setMapping('Transfer', 'manyName', 'transfers');

const OneLine = (props) => {
  const { object: transfer } = props;

  return transfer.file_name;
};

function Transfer(props) {
  const { object: transfer } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={transfer} />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Transfer', transfer.id)}>
        <OneLine object={transfer} />
      </Link>
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

        <Link to={webUrl('Import', `new?transfer_id=${transfer.id}`)}>
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
}

Transfer.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
    content_type: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Transfer.defaultProps = {
  mode: '',
};

setMapping('Transfer', 'showObject', Transfer);

function ShowTransfers(props) {
  const {
    mode, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="Transfer"
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowTransfers.propTypes = {
  mode: PropTypes.string,
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowTransfers.defaultProps = {
  mode: '',
  objects: [],
};

setMapping('Transfer', 'showObjects', ShowTransfers);

function IndexTransfer() {
  return (
    <Index
      _type_="Transfer"
    />
  );
}

function ShowTransfer() {
  return (
    <Show
      _type_="Transfer"
      noReferences
    />
  );
}

export { IndexTransfer, ShowTransfer };
