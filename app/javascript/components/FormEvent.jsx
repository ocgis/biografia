import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class EditEvent extends React.Component {
  constructor(props) {
    super(props);

    const { object: event } = props;
    this.state = { event: JSON.parse(JSON.stringify(event)) };
  }

  render = () => {
    const { onChange } = this.props;
    const { event } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Namn:
            </td>
            <td>
              <Input
                defaultValue={event.name}
                onChange={(e) => {
                  event.name = e.target.value;
                  onChange({ event });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
EditEvent.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
EditEvent.defaultProps = {
  object: {
    name: null,
    source: null,
  },
};

export default EditEvent;
