import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditEvent from './EditEvent';
import {
  setMapping, showObject, manyName, webUrl,
} from './Mappings';

setMapping('Event', 'oneName', 'event');
setMapping('Event', 'manyName', 'events');
setMapping('Event', 'filterFields', ['name']);

const ListRelated = (props) => {
  const { object } = props;

  if (object.related == null) {
    return null;
  }

  const { relatedType } = props;
  const { prefix } = props;
  const ShowObject = showObject(relatedType);
  const { currentUser } = props;
  const relObjs = object.related[manyName(relatedType)];

  if (relObjs.length === 0) {
    return null;
  }

  let parts = [];
  if (prefix != null) {
    parts.push(prefix);
  }

  parts = parts.concat(relObjs.map((relObj) => (
    <Link to={webUrl(relatedType, relObj.id)} key={relObj.id}>
      <ShowObject
        object={relObj}
        currentUser={currentUser}
        mode="oneLine"
        reload={() => alert('Unexpected: Implement reload() for ListRelated()')}
      />
      {' '}
    </Link>
  )));

  return parts;
};

const Event = (props) => {
  const {
    currentUser, mode, object: event, reload,
  } = props;

  if (mode === 'oneLine') {
    return event.name;
  }

  let name = null;
  if (mode === 'full') {
    name = event.name;
  } else {
    name = (
      <Link to={webUrl('Event', event.id)}>
        {event.name}
      </Link>
    );
  }
  return (
    <Base
      object={event}
      editTitle="Ändra händelse"
      modifierProps={{
        showAddAddress: true,
        showAddPerson: true,
        showAddNote: true,
        showAddThing: true,
        showAddEventDate: true,
        showMergeWith: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      <ListRelated object={event} relatedType="EventDate" currentUser={currentUser} />
      {name}
      <ListRelated object={event} relatedType="Person" currentUser={currentUser} prefix=" med " />
      <ListRelated object={event} relatedType="Address" currentUser={currentUser} prefix=" vid " />
    </Base>
  );
};

Event.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Event.defaultProps = {
  mode: '',
};

setMapping('Event', 'showObject', Event);

setMapping('Event', 'editObject', EditEvent);

const IndexEvent = () => (
  <Index
    _type_="Event"
  />
);

const ShowEvent = () => (
  <Show
    _type_="Event"
  />
);

const VersionEvent = () => (
  <Version
    _type_="Event"
  />
);

export { IndexEvent, ShowEvent, VersionEvent };
