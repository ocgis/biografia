import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditEvent from './EditEvent';
import ListObjects from './ListObjects';
import {
  setMapping, showObject, manyName, webUrl,
} from './Mappings';

setMapping('Event', 'oneName', 'event');
setMapping('Event', 'manyName', 'events');
setMapping('Event', 'filterFields', ['name']);

function ListRelated({
  object, relatedType, prefix = null, currentUser,
}) {
  if (object.related == null) {
    return null;
  }

  const ShowObject = showObject(relatedType);
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
}

ListRelated.propTypes = {
  object: PropTypes.shape().isRequired,
  relatedType: PropTypes.string.isRequired,
  currentUser: PropTypes.shape().isRequired,
  prefix: PropTypes.string,
};

function Event({
  currentUser = null, mode = '', parent = null, object: event, reload = null,
}) {
  if (mode === 'oneLine') {
    return event.name;
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('Event', event.id)}>
        {event.name}
      </Link>
    );
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
      parent={parent}
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
}

Event.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

setMapping('Event', 'showObject', Event);

function ShowEvents({
  mode = '', parent = null, objects = [], currentUser, reload,
}) {
  return (
    <ListObjects
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowEvents.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

setMapping('Event', 'showObjects', ShowEvents);

setMapping('Event', 'editObject', EditEvent);

function IndexEvent() {
  return (
    <Index
      _type_="Event"
    />
  );
}

function ShowEvent() {
  return (
    <Show
      _type_="Event"
    />
  );
}

function VersionEvent() {
  return (
    <Version
      _type_="Event"
    />
  );
}

export { IndexEvent, ShowEvent, VersionEvent };
