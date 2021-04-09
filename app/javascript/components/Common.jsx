import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import { AddPerson } from './Person';

const Modifier = (props) => {
  const modalState = {};
  ['person'].forEach((e) => {
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

  const { currentUser } = props;

  if (currentUser.roles.includes('editor')) {
    const menu = (
      <Menu onClick={menuItemClicked}>
        <Menu.Item key="person">lägg till person</Menu.Item>
      </Menu>
    );
    return (
      <td>
        <Dropdown overlay={menu} trigger="click">
          <PlusCircleOutlined />
        </Dropdown>
        <Modal
          title="Lägg till person"
          visible={modalState.person.isVisible}
          footer={null}
        >
          <AddPerson onFinish={() => { okButtonClicked('person'); }} />
        </Modal>
      </td>
    );
  }
  return null;
};
Modifier.propTypes = {
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
