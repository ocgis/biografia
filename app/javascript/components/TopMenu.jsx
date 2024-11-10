import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Col,
  Menu,
  Input,
  Modal,
  Row,
} from 'antd';
import { editObject, oneName, webUrl } from './Mappings';

const { SubMenu } = Menu;

function TopMenu(props) {
  const { currentUser } = props;
  const navigate = useNavigate();
  const [modalKey, setModalKey] = useState(null);

  const showModal = () => {
    const modals = {
      addPerson: {
        title: 'Lägg till person',
        component: editObject('Person'),
        _type_: 'Person',
      },
      addEvent: {
        title: 'Lägg till händelse',
        component: editObject('Event'),
        _type_: 'Event',
      },
      addAddress: {
        title: 'Lägg till adress',
        component: editObject('Address'),
        _type_: 'Address',
      },
      addThing: {
        title: 'Lägg till sak',
        component: editObject('Thing'),
        _type_: 'Thing',
      },
      addExport: {
        title: 'Exportera fil',
        component: editObject('Export'),
        _type_: 'Export',
      },
    };

    const modal = modals[modalKey];
    if (modal == null) {
      return null;
    }

    const onCancel = () => setModalKey(null);
    const onOk = (result) => {
      setModalKey(null);
      navigate(webUrl(modal._type_, result[oneName(modal._type_)].id));
    };

    const Component = modal.component;
    return (
      <Modal
        title={modal.title}
        open
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
    switch (object.key) {
      case 'searchMediaLocally':
        navigate(webUrl('Medium', 'search'));
        break;

      default:
        setModalKey(object.key);
    }
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
              onTitleClick={() => navigate(webUrl('Person'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addPerson">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="events"
              title="Händelser"
              onTitleClick={() => navigate(webUrl('Event'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addEvent">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="media"
              title="Media"
              onTitleClick={() => navigate(webUrl('Medium'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addMedia">
                Lägg till
              </Menu.Item>
              <Menu.Item key="searchMediaLocally">
                Sök lokalt
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="addresses"
              title="Adresser"
              onTitleClick={() => navigate(webUrl('Address'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addAddress">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="things"
              title="Saker"
              onTitleClick={() => navigate(webUrl('Thing'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addThing">
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="transfers"
              title="Överföringar"
              onTitleClick={() => navigate(webUrl('Transfer'))}
            >
              <Menu.Item key="transferFile">
                Överför fil
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="exports"
              title="Exporter"
              onTitleClick={() => navigate(webUrl('Export'))}
              onClick={menuClicked}
            >
              <Menu.Item key="addExport">
                Exportera fil
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="user">
              <Link to={webUrl('User')}>Användare</Link>
            </Menu.Item>
            <Menu.Item key="signOut">
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
}
TopMenu.propTypes = {
  currentUser: PropTypes.shape({ name: PropTypes.string.isRequired }),
};
TopMenu.defaultProps = {
  currentUser: { name: '' },
};

export default TopMenu;
