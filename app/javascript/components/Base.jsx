import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Modifier, VersionInfo } from './Common';

const Base = (props) => {
  const {
    currentUser, mode, object, reload, children, appendElements,
    editComponent: Edit, editTitle, modifierProps,
  } = props;

  const [modalIsVisible, modalSetVisible] = useState(false);
  const editClicked = () => {
    modalSetVisible(true);
  };
  const okButtonClicked = () => {
    modalSetVisible(false);
    reload();
  };
  const cancelButtonClicked = () => {
    modalSetVisible(false);
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {children}
            </td>
            {
              (mode === 'full' && currentUser.roles.includes('editor'))
              && (
                <td>
                  <EditOutlined onClick={editClicked} />
                </td>
              )
            }
            <Modifier
              currentUser={currentUser}
              mainObject={object}
              reload={reload}
              {...modifierProps}
            />
            {
              (mode === 'full' && modalIsVisible)
              && (
                <Modal
                  title={editTitle}
                  visible
                  closable={false}
                  footer={null}
                >
                  <Edit
                    object={object}
                    onOk={(response) => { okButtonClicked(response); }}
                    onCancel={(response) => { cancelButtonClicked(response); }}
                  />
                </Modal>
              )
            }
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
  mode: PropTypes.string,
};

Base.defaultProps = {
  children: null,
  appendElements: null,
  modifierProps: {},
  mode: '',
};

export default Base;
