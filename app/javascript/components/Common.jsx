import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  LinkOutlined, MessageOutlined, PlusCircleOutlined, TagOutlined,
} from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import AddReference from './AddReference';
import Merge from './Merge';
import TagMedium from './TagMedium';
import RemoveReference from './RemoveReference';
import RemoveObject from './RemoveObject';
import { editObject, webUrl } from './Mappings';

function Modifier(props) {
  const { currentUser } = props;
  if (!currentUser.roles.includes('editor')) {
    return null;
  }

  const {
    mainObject, parent, reload, showAddAddress, showAddPerson, showAddEvent,
    showAddNote, showAddEventDate, showAddRelationship, showAddThing,
    showTagMedium, showMergeWith, editTitle, modalWidth,
  } = props;

  const itemList = [];
  if (showAddEvent) {
    itemList.push({
      key: 'event',
      text: 'lägg till händelse',
      component: editObject('Event'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddNote) {
    itemList.push({
      key: 'note',
      text: 'kommentera',
      component: editObject('Note'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddEventDate) {
    itemList.push({
      key: 'eventDate',
      text: 'lägg till datum',
      component: editObject('EventDate'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddAddress) {
    itemList.push({
      key: 'address',
      text: 'lägg till adress',
      component: editObject('Address'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddRelationship) {
    itemList.push({
      key: 'relationship',
      text: 'lägg till förhållande',
      component: editObject('Relationship'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddPerson) {
    itemList.push({
      key: 'person',
      text: 'lägg till person',
      component: editObject('Person'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (showAddThing) {
    itemList.push({
      key: 'thing',
      text: 'lägg till sak',
      component: editObject('Thing'),
      props: { extraData: { referFrom: mainObject } },
    });
  }

  if (editTitle != null) {
    itemList.push({
      key: 'update',
      text: 'ändra',
      title: editTitle,
      component: editObject(mainObject._type_),
      props: {
        object: mainObject,
        extraData: {
          reference: mainObject.reference,
          referFrom: parent,
        },
      },
    });
  }

  itemList.push({
    key: 'reference',
    text: 'referera till',
    component: AddReference,
    props: {
      referFrom: mainObject,
      currentUser,
    },
  });

  if (showMergeWith) {
    itemList.push({
      key: 'mergeWith',
      text: 'slå ihop med',
      component: Merge,
      props: {
        object: mainObject,
      },
    });
  }

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

  const addReferenceClicked = () => {
    setModalKey('reference');
  };

  const addNoteClicked = () => {
    setModalKey('note');
  };

  const tagMediumClicked = () => {
    setModalKey('tagMedium');
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

  const menu = {
    items: itemList.map((item) => ({ key: item.key, label: item.text })),
    onClick: menuItemClicked,
  };

  return (
    <td>
      <Dropdown menu={menu} trigger="click">
        <PlusCircleOutlined />
      </Dropdown>
      <LinkOutlined onClick={addReferenceClicked} />
      { showAddNote
        && (
          <MessageOutlined onClick={addNoteClicked} />
        ) }
      { showTagMedium
        && (
          <TagOutlined onClick={tagMediumClicked} />
        ) }
      { showModal() }
    </td>
  );
}
Modifier.propTypes = {
  mainObject: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    reference: PropTypes.shape({}),
    parent: PropTypes.shape({}),
  }).isRequired,
  parent: PropTypes.shape(),
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
  showMergeWith: PropTypes.bool,
  editTitle: PropTypes.string,
  modalWidth: PropTypes.number,
};
Modifier.defaultProps = {
  parent: null,
  showAddAddress: false,
  showAddPerson: false,
  showAddEvent: false,
  showAddEventDate: false,
  showAddNote: false,
  showAddRelationship: false,
  showAddThing: false,
  showTagMedium: false,
  showMergeWith: false,
  editTitle: null,
  modalWidth: null,
};

function VersionInfo(props) {
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
  return null;
}
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
