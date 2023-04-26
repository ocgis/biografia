import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input } from 'antd';

class FormEventDate extends React.Component {
  constructor(props) {
    super(props);

    const { object } = props;
    const eventDate = JSON.parse(JSON.stringify(object));
    if (eventDate.date != null && eventDate.mask != null) {
      eventDate.date = moment(eventDate.date).format(eventDate.mask);
    }
    this.state = { eventDate };
  }

  componentDidMount() {
    const { onChange } = this.props;
    const { eventDate } = this.state;
    onChange({ event_date: eventDate });
  }

  render() {
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
FormEventDate.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormEventDate.defaultProps = {
  object: {
    date: null,
    source: null,
  },
};

export default FormEventDate;
