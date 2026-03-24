import {
  setKey, setRegion, setLanguage, fromLatLng,
} from 'react-geocode';
import Config from './Config';

const geocodingFromPosition = (latitude, longitude, callback) => {
  const { publicApiKey } = Config.google;
  setKey(publicApiKey);
  setRegion('se');
  setLanguage('sv');
  fromLatLng(latitude, longitude)
    .then(({ results }) => callback(results))
    .catch(console.log('ERROR: fromLatLng failed!')); // eslint-disable-line no-console
};

const addressFromPosition = (latitude, longitude, callback) => {
  geocodingFromPosition(latitude, longitude, (results) => {
    const postalTownArray = results.filter((entry) => entry.types.includes('postal_town'));
    if (postalTownArray.length > 0) {
      const address = postalTownArray[0].formatted_address;
      callback(address);
    }
  });
};

const placesFromPosition = (latitude, longitude, callback) => {
  geocodingFromPosition(latitude, longitude, (results) => {
    const places = results.filter((entry) => entry.types.includes('establishment'));
    callback(places);
  });
};

export { addressFromPosition, placesFromPosition };
