import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Col,
  Menu,
  Input,
  Modal,
  Row,
} from 'antd';
import EditEvent from './EditEvent';
import EditPerson from './EditPerson';

const { SubMenu } = Menu;

const TopMenu = (props) => {
  const { currentUser } = props;
  const history = useHistory();
  const [modalKey, setModalKey] = useState(null);

  const showModal = () => {
    const modals = {
      addPerson: {
        title: 'Lägg till person',
        component: EditPerson,
        type_: 'person',
        controller: 'people',
      },
      addEvent: {
        title: 'Lägg till händelse',
        component: EditEvent,
        type_: 'event',
        controller: 'events',
      },
    };

    const modal = modals[modalKey];
    if (modal == null) {
      return null;
    }

    const onCancel = () => setModalKey(null);
    const onOk = (result) => {
      setModalKey(null);
      history.push(`/r/${modal.controller}/${result[modal.type_].id}`);
    };

    const Component = modal.component;
    return (
      <Modal
        title={modal.title}
        visible
        closable={false}
        footer={null}
      >
        <Component
          onOk={onOk}
          onCancel={onCancel}
        />
      </Modal>
    );
  };

  const menuClicked = (object) => {
    setModalKey(object.key);
  };

  let personCol = '';
  if (currentUser != null) {
    personCol = (
      <Col span={12}>
        {currentUser.name}
      </Col>
    );
  }

  return (
    <div>
      { showModal() }
      <Row>
        <Col span={24}>
          <Menu mode="horizontal">
            <SubMenu
              key="people"
              title="Personer"
              onTitleClick={() => history.push('/r/people')}
              onClick={menuClicked}
            >
              <Menu.Item key="addPerson">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu
              title="Händelser"
              onTitleClick={() => history.push('/r/events')}
              onClick={menuClicked}
            >
              <Menu.Item key="addEvent">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Media" onTitleClick={() => history.push('/r/media')}>
              <Menu.Item>
                Lägg till
              </Menu.Item>
              <Menu.Item>
                Sök lokalt
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Adresser" onTitleClick={() => history.push('/r/addresses')}>
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Saker" onTitleClick={() => history.push('/r/things')}>
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Överföringar" onTitleClick={() => history.push('/r/transfers')}>
              <Menu.Item>
                Överför fil
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Exporter" onTitleClick={() => history.push('/r/exports')}>
              <Menu.Item>
                Exportera fil
              </Menu.Item>
            </SubMenu>
            <Menu.Item>
              <Link to="/r/users">Användare</Link>
            </Menu.Item>
            <Menu.Item>
              <a href="/users/sign_out" data-method="delete">Logga ut</a>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
      <Row>
        { personCol }
        <Col span={12}>
          <Input.Search />
        </Col>
      </Row>
    </div>
  );
};
TopMenu.propTypes = {
  currentUser: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

export default TopMenu;
