import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modifier, VersionInfo } from './Common';

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
      <Link to={`/r/event_dates/${eventDate.id}`}>
        <OneLine object={eventDate} />
      </Link>
    );
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {name}
            </td>
            <Modifier
              currentUser={currentUser}
              mainObject={eventDate}
              reload={reload}
            />
            <td>
              <VersionInfo object={eventDate} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

EventDate.propTypes = {
  object: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

EventDate.defaultProps = {
  mode: '',
};

export default EventDate;
