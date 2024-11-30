import React from 'react';
import PropTypes from 'prop-types';
import SelectMedium from './SelectMedium';

class FormMedium extends React.Component {
  constructor(props) {
    super(props);
    const { onChange } = props;

    /* FIXME
     * const { object: medium, onChange } = props;
     * this.state = { medium: JSON.parse(JSON.stringify(medium)) }; */
    this.state = { media: [] };
    onChange(this.state);
  }

  render() {
    const selectedMediaUpdated = (media) => {
      const { onChange } = this.props;
      onChange({ media });
    };

    return (
      <table>
        <tbody>
          <tr>
            <td aria-label="Select medium">
              <SelectMedium selectable bottomMargin={42} onChange={selectedMediaUpdated} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormMedium.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormMedium.defaultProps = {
  object: {
    file_name: null,
  },
};

export default FormMedium;
