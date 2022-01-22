import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormThing extends React.Component {
  constructor(props) {
    super(props);

    const { object: thing } = props;
    this.state = { thing: JSON.parse(JSON.stringify(thing)) };
  }

  render = () => {
    const { onChange } = this.props;
    const { thing } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Namn:
            </td>
            <td>
              <Input
                defaultValue={thing.name}
                onChange={(event) => {
                  thing.name = event.target.value;
                  onChange({ thing });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Typ:
            </td>
            <td>
              <Input
                defaultValue={thing.kind}
                onChange={(event) => {
                  thing.kind = event.target.value;
                  onChange({ thing });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Märke:
            </td>
            <td>
              <Input
                defaultValue={thing.make}
                onChange={(event) => {
                  thing.make = event.target.value;
                  onChange({ thing });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              Serienummer:
            </td>
            <td>
              <Input
                defaultValue={thing.serial}
                onChange={(event) => {
                  thing.serial = event.target.value;
                  onChange({ thing });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormThing.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormThing.defaultProps = {
  object: {
    name: null,
    kind: null,
    make: null,
    model: null,
    serial: null,
  },
};

export default FormThing;
