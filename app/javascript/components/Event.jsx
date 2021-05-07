import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';
import { EventDate } from './EventDate';
import { Person } from './Person';
import { Address } from './Address';

const ListRelated = (props) => {
  const { object } = props;
  const { relatedName } = props;
  const { prefix } = props;
  const { oneLine: OneLine } = props;
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
      <OneLine object={relObj} currentUser={currentUser} />
      {' '}
    </Link>
  )));

  return parts;
};

const Event = (props) => {
  const { object: event } = props;
  const { currentUser } = props;
  const { showFull } = props;

  let name = null;
  if (showFull) {
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
              <ListRelated object={event} oneLine={EventDate.OneLine} relatedName="event_dates" currentUser={currentUser} />
              {name}
              <ListRelated object={event} oneLine={Person.OneLine} relatedModule="Person" relatedName="people" currentUser={currentUser} prefix=" med " />
              <ListRelated object={event} oneLine={Address.OneLine} relatedModule="Address" relatedName="addresses" currentUser={currentUser} prefix=" vid " />
            </td>
            <Modifier currentUser={currentUser} />
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
  showFull: PropTypes.bool,
};

Event.defaultProps = {
  showFull: false,
};

export { Event as default, Event };
