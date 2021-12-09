import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import EventDate from './EventDate';
import Person from './Person';
import Address from './Address';
import EditEvent from './EditEvent';
import { manyName, webUrl } from './Mappings';

const ListRelated = (props) => {
  const { object } = props;
  const { relatedType } = props;
  const { prefix } = props;
  const { showObject: ShowObject } = props;
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
      editComponent={EditEvent}
      editTitle="Ändra händelse"
      modifierProps={{
        showAddAddress: true,
        showAddPerson: true,
        showAddNote: true,
        showAddThing: true,
        showAddEventDate: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      <ListRelated object={event} showObject={EventDate} relatedType="EventDate" currentUser={currentUser} />
      {name}
      <ListRelated object={event} showObject={Person} relatedType="Person" currentUser={currentUser} prefix=" med " />
      <ListRelated object={event} showObject={Address} relatedType="Address" currentUser={currentUser} prefix=" vid " />
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

export default Event;
