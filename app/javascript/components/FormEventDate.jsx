import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class EditEventDate extends React.Component {
  constructor(props) {
    super(props);

    const { object: eventDate } = props;
    this.state = { eventDate: JSON.parse(JSON.stringify(eventDate)) };
  }

  render = () => {
    const { onChange } = this.props;
    const { eventDate } = this.state;

    return (
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
                  onChange({ event_date: eventDate });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
EditEventDate.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
EditEventDate.defaultProps = {
  object: {
    date: null,
    source: null,
  },
};

export default EditEventDate;
