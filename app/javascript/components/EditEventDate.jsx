import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SaveData from './SaveData';

class EditEventDate extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'eventDate';
    this.apiUrl = '/api/v1/event_dates';

    const { eventDate, referFrom } = props;
    this.state = { eventDate: JSON.parse(JSON.stringify(eventDate)) };
    if (referFrom != null) {
      this.state.referFrom = {
        type_: referFrom.type_,
        id: referFrom.id,
      };
    }
  }

  render = () => {
    const handleResult = (result) => {
      const { onOk } = this.props;
      if (result.error == null) {
        onOk(result);
      } else {
        this.setState({ error: result.error });
      }
    };

    const okButtonClicked = () => {
      this.saveData(handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { eventDate, error } = this.state;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Datum:
              </td>
              <td>
                <Input
                  defaultValue={eventDate.date}
                  onChange={(event) => {
                    eventDate.date = event.target.value;
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <CheckOutlined onClick={okButtonClicked} />
        <CloseOutlined onClick={closeButtonClicked} />
        { error }
      </div>
    );
  }
}
EditEventDate.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  eventDate: PropTypes.shape(),
  referFrom: PropTypes.shape({
    type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditEventDate.defaultProps = {
  eventDate: {
    date: null,
    source: null,
  },
  referFrom: null,
};

export default EditEventDate;
