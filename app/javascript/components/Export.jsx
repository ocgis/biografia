import React from 'react';
import PropTypes from 'prop-types';
import Index from './Index';
import Show from './Show';
import Edit from './Edit';
import FormExport from './FormExport';
import { setMapping } from './Mappings';

setMapping('Export', 'oneName', 'export');
setMapping('Export', 'manyName', 'exports');

const OneLine = (props) => {
  const { object } = props;

  return `${object.file_name} (${object.content_type})`;
};

const Export = (props) => {
  const { object } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={object} />
    );
  }

  let element = null;
  if (mode === 'full') {
    element = (
      <div>
        <h1>
          {object.file_name}
        </h1>

        <a href={`/exports/${object.id}/file`}>
          {object.file_name}
        </a>

        <div id="status">
          {object.status}
        </div>
      </div>
    );
  } else {
    element = 'Implement limited display of exports';
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

Export.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
    content_type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Export.defaultProps = {
  mode: '',
};

setMapping('Export', 'showObject', Export);

const EditExport = (props) => {
  const {
    object, extraData, onOk, onCancel,
  } = props;

  return (
    <Edit
      _type_="Export"
      object={object}
      formObject={FormExport}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
};
EditExport.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditExport.defaultProps = {
  object: undefined,
  extraData: undefined,
};

setMapping('Export', 'editObject', EditExport);

const IndexExport = () => (
  <Index
    _type_="Export"
  />
);

const ShowExport = ({ match, location }) => (
  <Show
    _type_="Export"
    match={match}
    location={location}
    noReferences
    reloadInterval={3000}
  />
);
ShowExport.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export { IndexExport, ShowExport };
