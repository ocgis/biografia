import React from 'react';
import PropTypes from 'prop-types';
import { addressFromPosition } from './Geocoding';

class AddressFromPosition extends React.Component {
  constructor(props) {
    super(props);

    const { latitude, longitude } = this.props;

    this.state = { address: `${latitude}; ${longitude}` };
  }

  componentDidMount() {
    const { latitude, longitude } = this.props;
    addressFromPosition(latitude, longitude, (address) => this.setState({ address }));
  }

  render() {
    const { address } = this.state;
    return address;
  }
}
AddressFromPosition.propTypes = {
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
};

export default AddressFromPosition;
