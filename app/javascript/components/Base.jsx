import React from 'react';
import PropTypes from 'prop-types';
import { Modifier, VersionInfo } from './Common';

function Base(props) {
  const {
    currentUser, object, parent, reload, children, appendElements,
    editTitle, modifierProps, modalWidth,
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
              parent={parent}
              editTitle={editTitle}
              reload={reload}
              {...modifierProps}
              modalWidth={modalWidth}
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
}

Base.propTypes = {
  children: PropTypes.node,
  appendElements: PropTypes.node,
  object: PropTypes.shape().isRequired,
  parent: PropTypes.shape(),
  editTitle: PropTypes.string,
  modifierProps: PropTypes.shape(),
  modalWidth: PropTypes.number,
  currentUser: PropTypes.shape(),
  reload: PropTypes.func,
};

Base.defaultProps = {
  parent: null,
  children: null,
  appendElements: null,
  editTitle: null,
  modifierProps: {},
  modalWidth: null,
  currentUser: null,
  reload: null,
};

export default Base;
