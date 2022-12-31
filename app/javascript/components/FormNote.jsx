import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormNote extends React.Component {
  constructor(props) {
    super(props);

    const { object: note, onChange } = props;
    this.state = { note: JSON.parse(JSON.stringify(note)) };
    onChange(this.state);
  }

  render() {
    const { onChange } = this.props;
    const { note } = this.state;

    return (
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
                  onChange({ note });
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
                rows={10}
                cols={120}
                defaultValue={note.note}
                onChange={(event) => {
                  note.note = event.target.value;
                  onChange({ note });
                }}
                style={{ fontFamily: 'monospace' }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormNote.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormNote.defaultProps = {
  object: {
    category: null,
    title: null,
    note: null,
    source: null,
  },
};

export default FormNote;
