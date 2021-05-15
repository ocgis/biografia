import React from 'react';
import PropTypes from 'prop-types';

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
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Export.defaultProps = {
  mode: '',
};

export default Export;
