import React from 'react';
import PropTypes from 'prop-types';
import { setKey, fromLatLng } from 'react-geocode';
import Config from './Config';

class AddressFromPosition extends React.Component {
  constructor(props) {
    super(props);

    const { latitude, longitude } = this.props;

    this.state = { address: `${latitude}; ${longitude}` };
  }

  componentDidMount() {
    const { publicApiKey: apiKey } = Config.google;
    const { latitude, longitude } = this.props;
    setKey(apiKey);
    fromLatLng(latitude, longitude).then(({ results }) => {
      const postalTownArray = results.filter((entry) => entry.types.includes('postal_town'));
      if (postalTownArray.length > 0) {
        this.setState({ address: postalTownArray[0].formatted_address });
      }
    }).catch(console.error);
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
