import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class EditEvent extends React.Component {
  constructor(props) {
    super(props);

    const { object: event, referFrom } = props;
    this.state = { event: JSON.parse(JSON.stringify(event)) };
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
      saveData('Event', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { event, error } = this.state;

    return (
      <div>
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
EditEvent.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditEvent.defaultProps = {
  object: {
    name: null,
    source: null,
  },
  referFrom: null,
};

export default EditEvent;
