import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormExport extends React.Component {
  constructor(props) {
    super(props);

    const { object } = props;
    this.state = { object: JSON.parse(JSON.stringify(object)) };
  }

  componentDidMount() {
    const { onChange } = this.props;
    const { object } = this.state;
    onChange({ export: object });
  }

  render = () => {
    const { onChange } = this.props;
    const { object } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Filnamn:
            </td>
            <td>
              <Input
                defaultValue={object.file_name}
                onChange={(event) => {
                  object.file_name = event.target.value;
                  onChange({ export: object });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Innehåll:
            </td>
            <td>
              <Input
                defaultValue={object.content_type}
                onChange={(event) => {
                  object.content_type = event.target.value;
                  onChange({ export: object });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormExport.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormExport.defaultProps = {
  object: {
    file_name: 'test.xml',
    content_type: 'application/biografia-xml',
  },
};

export default FormExport;
