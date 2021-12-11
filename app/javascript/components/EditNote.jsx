import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class EditNote extends React.Component {
  constructor(props) {
    super(props);

    const { object: note, referFrom } = props;
    this.state = { note: JSON.parse(JSON.stringify(note)) };
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
      saveData('Note', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { note, error } = this.state;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Rubrik:
              </td>
              <td>
                <Input
                  defaultValue={note.title}
                  onChange={(event) => {
                    note.title = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Kommentar:
              </td>
              <td>
                <Input.TextArea
                  rows={40}
                  cols={120}
                  defaultValue={note.note}
                  onChange={(event) => {
                    note.note = event.target.value;
                  }}
                  style={{ fontFamily: 'monospace' }}
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
EditNote.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditNote.defaultProps = {
  object: {
    category: null,
    title: null,
    note: null,
    source: null,
  },
  referFrom: null,
};

export default EditNote;
