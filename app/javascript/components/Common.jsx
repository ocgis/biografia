import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import EditPerson from './EditPerson';
import AddReference from './AddReference';
import RemoveReference from './RemoveReference';

const Modifier = (props) => {
  const { currentUser } = props;
  if (!currentUser.roles.includes('editor')) {
    return null;
  }

  const { mainObject, reload } = props;

  const itemList = [
    {
      key: 'person',
      text: 'lägg till person',
      component: EditPerson,
      props: { referFrom: mainObject },
    },
    {
      key: 'reference',
      text: 'referera till',
      component: AddReference,
      props: { referFrom: mainObject },
    },
  ];

  if (mainObject.reference != null) {
    itemList.push({
      key: 'removeReference',
      text: 'ta bort referens',
      component: RemoveReference,
      props: { reference: mainObject.reference },
    });
  }

  const modalState = {};
  ['person', 'reference', 'removeReference'].forEach((e) => {
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
    reload();
  };

  const cancelButtonClicked = (key) => {
    modalState[key].setVisible(false);
  };

  const menu = (
    <Menu onClick={menuItemClicked}>
      { itemList.map((item) => (<Menu.Item key={item.key}>{item.text}</Menu.Item>)) }
    </Menu>
  );
  return (
    <td>
      <Dropdown overlay={menu} trigger="click">
        <PlusCircleOutlined />
      </Dropdown>
      {itemList.map((item) => {
        if (!modalState[item.key].isVisible) {
          return null;
        }
        /* eslint-disable react/jsx-props-no-spreading */
        const Component = item.component;
        return (
          <Modal
            title={item.text}
            visible
            closable={false}
            footer={null}
            key={item.key}
          >
            <Component
              {...item.props}
              onOk={() => { okButtonClicked(item.key); }}
              onCancel={() => { cancelButtonClicked(item.key); }}
            />
          </Modal>
        );
      })}
    </td>
  );
};
Modifier.propTypes = {
  mainObject: PropTypes.shape({
    type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    reference: PropTypes.shape({}),
  }).isRequired,
  reload: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
Modifier.defaultProps = {
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
