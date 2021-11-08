import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';
import EventDate from './EventDate';
import Person from './Person';
import Address from './Address';

const ListRelated = (props) => {
  const { object } = props;
  const { relatedName } = props;
  const { prefix } = props;
  const { showObject: ShowObject } = props;
  const { currentUser } = props;
  const relObjs = object.related[relatedName];

  if (relObjs.length === 0) {
    return null;
  }

  let parts = [];
  if (prefix != null) {
    parts.push(prefix);
  }

  parts = parts.concat(relObjs.map((relObj) => (
    <Link to={`/r/${relatedName}/${relObj.id}`} key={relObj.id}>
      <ShowObject object={relObj} currentUser={currentUser} mode="oneLine" />
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
      <Link to={`/r/events/${event.id}`}>
        {event.name}
      </Link>
    );
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <ListRelated object={event} showObject={EventDate} relatedName="event_dates" currentUser={currentUser} />
              {name}
              <ListRelated object={event} showObject={Person} relatedModule="Person" relatedName="people" currentUser={currentUser} prefix=" med " />
              <ListRelated object={event} showObject={Address} relatedModule="Address" relatedName="addresses" currentUser={currentUser} prefix=" vid " />
            </td>
            <Modifier
              currentUser={currentUser}
              mainObject={event}
              reload={reload}
              showAddPerson
            />
            <td>
              <VersionInfo object={event} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Event.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Event.defaultProps = {
  mode: '',
};

export default Event;
