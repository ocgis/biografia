import React from 'react';
import PropTypes from 'prop-types';
import { Col, Menu, Input, Row } from 'antd';

const { SubMenu } = Menu;

const TopMenu = (props) => {
  const { currentUser } = props;

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
      <Row>
        <Col span={24}>
          <Menu mode="horizontal">
            <SubMenu title="Personer">
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Händelser">
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Media">
              <Menu.Item>
                Lägg till
              </Menu.Item>
              <Menu.Item>
                Sök lokalt
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Adresser">
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Saker">
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Överföringar">
              <Menu.Item>
                Överför fil
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Exporter">
              <Menu.Item>
                Exportera fil
              </Menu.Item>
            </SubMenu>
            <Menu.Item>
              Användare
            </Menu.Item>
            <Menu.Item>
              Logga ut
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

export { TopMenu };
