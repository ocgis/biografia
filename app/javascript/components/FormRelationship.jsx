import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

class FormRelationship extends React.Component {
  constructor(props) {
    super(props);

    const { object: relationship } = props;
    this.state = { relationship: JSON.parse(JSON.stringify(relationship)) };
  }

  render = () => {
    const { onChange } = this.props;
    const { relationship } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              Namn:
            </td>
            <td>
              <Input
                defaultValue={relationship.name}
                onChange={(event) => {
                  relationship.name = event.target.value;
                  onChange({ relationship });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormRelationship.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormRelationship.defaultProps = {
  object: {
    name: null,
  },
};

export default FormRelationship;
