import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import SaveData from './SaveData';

class EditEvent extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'event';
    this.apiUrl = '/api/v1/events';

    const { object: event, referFrom } = props;
    this.state = { event: JSON.parse(JSON.stringify(event)) };
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
    type_: PropTypes.string,
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
