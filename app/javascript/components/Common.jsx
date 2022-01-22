import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import AddReference from './AddReference';
import TagMedium from './TagMedium';
import RemoveReference from './RemoveReference';
import RemoveObject from './RemoveObject';
import { editObject, webUrl } from './Mappings';

const Modifier = (props) => {
  const { currentUser } = props;
  if (!currentUser.roles.includes('editor')) {
    return null;
  }

  const {
    mainObject, reload, showAddAddress, showAddPerson, showAddEvent,
    showAddNote, showAddEventDate, showAddRelationship, showAddThing,
    showTagMedium, editTitle, modalWidth,
  } = props;

  const itemList = [];
  if (showAddEvent) {
    itemList.push({
      key: 'event',
      text: 'lägg till händelse',
      component: editObject('Event'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddNote) {
    itemList.push({
      key: 'note',
      text: 'kommentera',
      component: editObject('Note'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddEventDate) {
    itemList.push({
      key: 'eventDate',
      text: 'lägg till datum',
      component: editObject('EventDate'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddAddress) {
    itemList.push({
      key: 'address',
      text: 'lägg till adress',
      component: editObject('Address'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddRelationship) {
    itemList.push({
      key: 'relationship',
      text: 'lägg till förhållande',
      component: editObject('Relationship'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddPerson) {
    itemList.push({
      key: 'person',
      text: 'lägg till person',
      component: editObject('Person'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (showAddThing) {
    itemList.push({
      key: 'thing',
      text: 'lägg till sak',
      component: editObject('Thing'),
      props: { extraData: { referFrom: { _type_: mainObject._type_, id: mainObject.id } } },
    });
  }

  if (editTitle != null) {
    itemList.push({
      key: 'update',
      text: 'ändra',
      title: editTitle,
      component: editObject(mainObject._type_),
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
    component: RemoveObject,
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
    _type_: PropTypes.string.isRequired,
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
  editTitle: null,
  modalWidth: null,
};

const VersionInfo = (props) => {
  const { object } = props;
  const { object: { version } } = props;

  if (version != null) {
    return (
      <Link to={webUrl(object._type_, object.id, 'examine')}>
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
    _type_: PropTypes.string,
    version: PropTypes.shape({
      date: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export { Modifier, VersionInfo };
