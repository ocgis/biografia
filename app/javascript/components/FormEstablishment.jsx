import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormEstablishment extends React.Component {
  constructor(props) {
    super(props);

    const { object: establishment } = props;
    this.state = { establishment: JSON.parse(JSON.stringify(establishment)) };
  }

  render() {
    const { onChange } = this.props;
    const { establishment } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Namn:
            </td>
            <td aria-label="Name">
              <Input
                defaultValue={establishment.name}
                onChange={(event) => {
                  establishment.name = event.target.value;
                  onChange({ establishment });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Typ:
            </td>
            <td aria-label="Kind">
              <Input
                defaultValue={establishment.kind}
                onChange={(event) => {
                  establishment.kind = event.target.value;
                  onChange({ establishment });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormEstablishment.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormEstablishment.defaultProps = {
  object: {
    name: null,
    kind: null,
  },
};

export default FormEstablishment;
