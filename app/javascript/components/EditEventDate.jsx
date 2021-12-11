import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class EditEventDate extends React.Component {
  constructor(props) {
    super(props);

    const { object: eventDate, referFrom } = props;
    this.state = { event_date: JSON.parse(JSON.stringify(eventDate)) };
    if (referFrom != null) {
      this.state.referFrom = {
        _type_: referFrom._type_,
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
      saveData('EventDate', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { event_date: eventDate, error } = this.state;

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
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditEventDate.defaultProps = {
  object: {
    date: null,
    source: null,
  },
  referFrom: null,
};

export default EditEventDate;
