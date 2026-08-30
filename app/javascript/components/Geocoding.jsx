import {
  setKey, setRegion, setLanguage, fromLatLng,
} from 'react-geocode';
import Config from './Config';
import { apiUrl } from './Mappings';
import { postRequest } from './Requests';

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
  const baseUrl = apiUrl('Establishment');
  const url = `${baseUrl}/by_position`;

  const data = {
    latitude,
    longitude,
  };
  const handleResponse = (response) => {
    if ('places' in response.data) {
      callback(response.data.places);
    } else {
      callback([]);
    }
  };
  const handleError = (error) => console.error('Geocoding: placesFromPosition: TODO: Handle error', error);
  postRequest(url, data, handleResponse, handleError);
};

export { addressFromPosition, placesFromPosition };
