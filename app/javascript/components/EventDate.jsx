import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Base from './Base';
import Show from './Show';
import Version from './Version';
import EditEventDate from './EditEventDate';
import ListObjects from './ListObjects';
import { setMapping, webUrl } from './Mappings';

setMapping('EventDate', 'oneName', 'event_date');
setMapping('EventDate', 'manyName', 'event_dates');

const OneLine = (props) => {
  const doubleDigit = (i) => {
    if (i < 10) {
      return `0${i}`;
    }
    return `${i}`;
  };

  const { object: eventDate } = props;

  let tzOffset = 0;
  let tzSuffix = '';
  if (eventDate.timezone_offset != null) {
    tzOffset = eventDate.timezone_offset;
    const absOffset = Math.abs(tzOffset);
    const hours = doubleDigit(absOffset / 60);
    const minutes = doubleDigit(absOffset % 60);

    if (eventDate.timezone_offset < 0) {
      tzSuffix = ` -${hours}:${minutes}`;
    } else {
      tzSuffix = ` +${hours}:${minutes}`;
    }
  }

  const maskToFormat = {
    YYYY: 'YYYY',
    'YYYY-MM': 'YYYY-MM',
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'YYYY-MM-DD hh:mm': 'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD hh:mm:ss': 'YYYY-MM-DD HH:mm:ss',
  };

  const dateStr = moment(eventDate.date).add(tzOffset, 'm').utc().format(maskToFormat[eventDate.mask]);

  return `${dateStr}${tzSuffix}`;
};

function EventDate(props) {
  const {
    currentUser, mode, parent, object: eventDate, reload,
  } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={eventDate} />
    );
  }

  if (mode === 'oneLineLinked') {
    return (
      <Link to={webUrl('EventDate', eventDate.id)}>
        <OneLine object={eventDate} />
      </Link>
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
      parent={parent}
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
}

EventDate.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.shape(),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

EventDate.defaultProps = {
  parent: null,
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('EventDate', 'showObject', EventDate);

function ShowEventDates(props) {
  const {
    mode, parent, objects, currentUser, reload,
  } = props;
  return (
    <ListObjects
      _type_="EventDate"
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowEventDates.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowEventDates.defaultProps = {
  mode: '',
  parent: null,
  objects: [],
};

setMapping('EventDate', 'showObjects', ShowEventDates);

setMapping('EventDate', 'editObject', EditEventDate);

function ShowEventDate() {
  return (
    <Show
      _type_="EventDate"
    />
  );
}

function VersionEventDate() {
  return (
    <Version
      _type_="EventDate"
    />
  );
}

export { ShowEventDate, VersionEventDate };
