import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Modifier, VersionInfo } from './Common';
import EditEventDate from './EditEventDate';

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

  const [modalIsVisible, modalSetVisible] = useState(false);
  const editEventDateClicked = () => {
    modalSetVisible(true);
  };
  const okButtonClicked = () => {
    modalSetVisible(false);
    reload();
  };
  const cancelButtonClicked = () => {
    modalSetVisible(false);
  };

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
            {
              (mode === 'full' && currentUser.roles.includes('editor'))
              && (
                <td>
                  <EditOutlined onClick={editEventDateClicked} />
                </td>
              )
            }
            <Modifier
              currentUser={currentUser}
              mainObject={eventDate}
              reload={reload}
            />
            {
              (mode === 'full' && modalIsVisible)
              && (
                <Modal
                  title="Ändra datum"
                  visible
                  closable={false}
                  footer={null}
                >
                  <EditEventDate
                    eventDate={eventDate}
                    onOk={(response) => { okButtonClicked(response); }}
                    onCancel={(response) => { cancelButtonClicked(response); }}
                  />
                </Modal>
              )
            }
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

export default EventDate;
