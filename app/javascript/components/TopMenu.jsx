import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Col,
  Menu,
  Input,
  Row,
} from 'antd';

const { SubMenu } = Menu;

const TopMenu = (props) => {
  const { currentUser } = props;
  const history = useHistory();

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
            <SubMenu title="Personer" onTitleClick={() => history.push('/r/people')}>
              <Menu.Item>
                Lägg till
              </Menu.Item>
            </SubMenu>
            <SubMenu title="Händelser" onTitleClick={() => history.push('/r/events')}>
              <Menu.Item>
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

export default TopMenu;
