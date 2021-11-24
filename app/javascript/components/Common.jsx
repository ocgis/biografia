import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import EditEvent from './EditEvent';
import EditEventDate from './EditEventDate';
import EditAddress from './EditAddress';
import EditPerson from './EditPerson';
import EditNote from './EditNote';
import EditRelationship from './EditRelationship';
import EditThing from './EditThing';
import AddReference from './AddReference';
import TagMedium from './TagMedium';
import RemoveReference from './RemoveReference';
import Remove from './Remove';
import { webUrl } from './Mappings';

const Modifier = (props) => {
  const { currentUser } = props;
  if (!currentUser.roles.includes('editor')) {
    return null;
  }

  const {
    mainObject, reload, showAddAddress, showAddPerson, showAddEvent,
    showAddNote, showAddEventDate, showAddRelationship, showAddThing,
    showTagMedium, editComponent, editTitle, modalWidth,
  } = props;

  const itemList = [];
  if (showAddEvent) {
    itemList.push({
      key: 'event',
      text: 'lägg till händelse',
      component: EditEvent,
      props: { referFrom: mainObject },
    });
  }

  if (showAddNote) {
    itemList.push({
      key: 'note',
      text: 'kommentera',
      component: EditNote,
      props: { referFrom: mainObject },
    });
  }

  if (showAddEventDate) {
    itemList.push({
      key: 'eventDate',
      text: 'lägg till datum',
      component: EditEventDate,
      props: { referFrom: mainObject },
    });
  }

  if (showAddAddress) {
    itemList.push({
      key: 'address',
      text: 'lägg till adress',
      component: EditAddress,
      props: { referFrom: mainObject },
    });
  }

  if (showAddRelationship) {
    itemList.push({
      key: 'relationship',
      text: 'lägg till förhållande',
      component: EditRelationship,
      props: { referFrom: mainObject },
    });
  }

  if (showAddPerson) {
    itemList.push({
      key: 'person',
      text: 'lägg till person',
      component: EditPerson,
      props: { referFrom: mainObject },
    });
  }

  if (showAddThing) {
    itemList.push({
      key: 'thing',
      text: 'lägg till sak',
      component: EditThing,
      props: { referFrom: mainObject },
    });
  }

  if (editComponent != null && editTitle != null) {
    itemList.push({
      key: 'update',
      text: 'ändra',
      title: editTitle,
      component: editComponent,
      props: { object: mainObject },
    });
  }

  itemList.push({
    key: 'reference',
    text: 'referera till',
    component: AddReference,
    props: { referFrom: mainObject },
  });

  if (showTagMedium) {
    itemList.push({
      key: 'tagMedium',
      text: 'tagga',
      component: TagMedium,
      props: { referFrom: mainObject },
    });
  }

  if (mainObject.reference != null) {
    itemList.push({
      key: 'removeReference',
      text: 'ta bort referens',
      component: RemoveReference,
      props: { reference: mainObject.reference },
    });
  }

  itemList.push({
    key: 'remove',
    text: 'radera',
    component: Remove,
    props: { object: mainObject },
  });

  const [modalKey, setModalKey] = useState(null);

  const menuItemClicked = (event) => {
    setModalKey(event.key);
  };

  const okButtonClicked = () => {
    setModalKey(null);
    reload();
  };

  const cancelButtonClicked = () => {
    setModalKey(null);
  };

  const showModal = () => {
    if (modalKey == null) {
      return null;
    }
    return itemList.map((item) => {
      if (item.key === modalKey) {
        let { title } = item;
        if (title == null) {
          title = item.text;
        }
        /* eslint-disable react/jsx-props-no-spreading */
        const Component = item.component;
        return (
          <Modal
            title={title}
            visible
            closable={false}
            footer={null}
            key={item.key}
            width={modalWidth}
          >
            <Component
              {...item.props}
              onOk={() => { okButtonClicked(item.key); }}
              onCancel={() => { cancelButtonClicked(item.key); }}
            />
          </Modal>
        );
      }
      return null;
    });
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
      { showModal() }
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
  showAddAddress: PropTypes.bool,
  showAddPerson: PropTypes.bool,
  showAddEvent: PropTypes.bool,
  showAddEventDate: PropTypes.bool,
  showAddNote: PropTypes.bool,
  showAddRelationship: PropTypes.bool,
  showAddThing: PropTypes.bool,
  showTagMedium: PropTypes.bool,
  editComponent: PropTypes.func,
  editTitle: PropTypes.string,
  modalWidth: PropTypes.number,
};
Modifier.defaultProps = {
  showAddAddress: false,
  showAddPerson: false,
  showAddEvent: false,
  showAddEventDate: false,
  showAddNote: false,
  showAddRelationship: false,
  showAddThing: false,
  showTagMedium: false,
  editComponent: null,
  editTitle: null,
  modalWidth: null,
};

const VersionInfo = (props) => {
  const { object } = props;
  const { object: { version } } = props;

  if (version != null) {
    return (
      <Link to={webUrl(object.type_, object.id, 'examine')}>
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
    type_: PropTypes.string,
    version: PropTypes.shape({
      date: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export { Modifier, VersionInfo };
