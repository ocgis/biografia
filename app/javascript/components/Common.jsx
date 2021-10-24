import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import EditPerson from './EditPerson';
import AddReference from './AddReference';

const Modifier = (props) => {
  const modalState = {};
  ['person', 'reference'].forEach((e) => {
    const us = useState(false);
    modalState[e] = {
      isVisible: us[0],
      setVisible: us[1],
    };
  });

  const menuItemClicked = (event) => {
    modalState[event.key].setVisible(true);
  };

  const okButtonClicked = (key) => {
    modalState[key].setVisible(false);
  };

  const cancelButtonClicked = (key) => {
    modalState[key].setVisible(false);
  };

  const { currentUser, mainObject } = props;

  if (currentUser.roles.includes('editor')) {
    const menu = (
      <Menu onClick={menuItemClicked}>
        <Menu.Item key="person">lägg till person</Menu.Item>
        <Menu.Item key="reference">referera till</Menu.Item>
      </Menu>
    );
    return (
      <td>
        <Dropdown overlay={menu} trigger="click">
          <PlusCircleOutlined />
        </Dropdown>
        {
          modalState.person.isVisible && (
            <Modal
              title="Lägg till person"
              visible
              closable={false}
              footer={null}
            >
              <EditPerson
                onOk={() => { okButtonClicked('person'); }}
                onCancel={() => { cancelButtonClicked('person'); }}
              />
            </Modal>
          )
        }
        {
          modalState.reference.isVisible && (
            <Modal
              title="Referera till"
              visible
              closable={false}
              footer={null}
            >
              <AddReference
                referFrom={mainObject}
                onOk={() => { okButtonClicked('reference'); }}
                onCancel={() => { cancelButtonClicked('reference'); }}
              />
            </Modal>
          )
        }
      </td>
    );
  }
  return null;
};
Modifier.propTypes = {
  mainObject: PropTypes.shape({
    type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const VersionInfo = (props) => {
  const { object } = props;
  const { object: { version } } = props;

  if (version != null) {
    return (
      <Link to={`/r/controller/${object.id}/examine`}>
        <span className="latest_update">
          {`Ändrad av ${version.name}`}
          <br />
          {version.date}
        </span>
      </Link>
    );
  }
  return (
    <span className="latest_update">
      Could not determine latest updater
    </span>
  );
};
VersionInfo.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    version: PropTypes.shape({
      date: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export { Modifier, VersionInfo };
