import React from 'react';
import PropTypes from 'prop-types';
import { Modifier, VersionInfo } from './Common';

const Base = (props) => {
  const {
    currentUser, object, reload, children, appendElements,
    editComponent, editTitle, modifierProps,
  } = props;

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {children}
            </td>
            <Modifier
              currentUser={currentUser}
              mainObject={object}
              editComponent={editComponent}
              editTitle={editTitle}
              reload={reload}
              {...modifierProps}
            />
            <td>
              <VersionInfo object={object} />
            </td>
          </tr>
        </tbody>
      </table>
      {appendElements}
    </div>
  );
};

Base.propTypes = {
  children: PropTypes.node,
  appendElements: PropTypes.node,
  object: PropTypes.shape().isRequired,
  editComponent: PropTypes.func.isRequired,
  editTitle: PropTypes.string.isRequired,
  modifierProps: PropTypes.shape(),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  reload: PropTypes.func.isRequired,
};

Base.defaultProps = {
  children: null,
  appendElements: null,
  modifierProps: {},
};

export default Base;
