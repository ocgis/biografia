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
  const { object: eventDate } = props;

  return moment(eventDate.date).utc().format(eventDate.mask);
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
