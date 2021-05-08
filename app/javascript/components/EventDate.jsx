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
  const { object: eventDate } = props;
  const { currentUser } = props;
  const { showFull } = props;

  let name = null;
  if (showFull) {
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
            <Modifier currentUser={currentUser} />
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
  showFull: PropTypes.bool,
};

EventDate.defaultProps = {
  showFull: false,
};

EventDate.OneLine = OneLine;

export default EventDate;
