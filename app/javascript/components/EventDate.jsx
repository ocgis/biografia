import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Base from './Base';
import Show from './Show';
import Version from './Version';
import EditEventDate from './EditEventDate';
import { setMapping, webUrl } from './Mappings';

setMapping('EventDate', 'oneName', 'event_date');
setMapping('EventDate', 'manyName', 'event_dates');

const OneLine = (props) => {
  const { object: eventDate } = props;

  return moment(eventDate.date).format(eventDate.mask);
};

const EventDate = (props) => {
  const {
    currentUser, mode, object: eventDate, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={eventDate} />
    );
  }

  let name = null;
  if (mode === 'full') {
    name = (
      <OneLine object={eventDate} />
    );
  } else {
    name = (
      <Link to={webUrl('EventDate', eventDate.id)}>
        <OneLine object={eventDate} />
      </Link>
    );
  }
  return (
    <Base
      object={eventDate}
      editTitle="Ändra datum"
      modifierProps={{
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {name}
    </Base>
  );
};

EventDate.propTypes = {
  object: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

EventDate.defaultProps = {
  mode: '',
};

setMapping('EventDate', 'showObject', EventDate);

setMapping('EventDate', 'editObject', EditEventDate);

const ShowEventDate = () => (
  <Show
    _type_="EventDate"
  />
);

const VersionEventDate = () => (
  <Version
    _type_="EventDate"
  />
);

export { ShowEventDate, VersionEventDate };
