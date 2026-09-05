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

const addressesFromPosition = (latitude, longitude, callback) => {
  geocodingFromPosition(latitude, longitude, (results) => {
    callback(results);
  });
};

const addressResultName = (address) => address.formatted_address;
const addressResultKey = (address) => address.place_id;

const addressResultToAddressObject = (result) => {
  const address = {};

  address.latitude = result.geometry.location.lat;
  address.longitude = result.geometry.location.lng;
  result.address_components.forEach((c) => {
    if (c.types.includes('country')) {
      address.country = c.long_name;
    }
    if (c.types.includes('route')) {
      if (address.street) {
        address.street = `${c.long_name} ${address.street}`;
      } else {
        address.street = c.long_name;
      }
    }
    if (c.types.includes('street_number')) {
      if (address.street) {
        address.street = `${address.street} ${c.long_name}`;
      } else {
        address.street = c.long_name;
      }
    }
    if (c.types.includes('postal_town')) {
      address.town = c.long_name;
    }
    if (c.types.includes('postal_code')) {
      address.zipcode = c.long_name;
    }
  });

  return address;
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

const placeResultName = (place) => place.displayName.text;
const placeResultFormattedAddress = (place) => place.formattedAddress;
const placeResultKey = (place) => place.id;

const placeResultType = (place) => {
  if (!place.primaryTypeDisplayName) {
    return undefined;
  }
  return place.primaryTypeDisplayName.text;
};

const placeResultToAddressObject = (place) => {
  const address = {};

  address.latitude = place.location.latitude;
  address.longitude = place.location.longitude;
  place.addressComponents.forEach((c) => {
    if (c.types.includes('country')) {
      address.country = c.longText;
    }
    if (c.types.includes('route')) {
      if (address.street) {
        address.street = `${c.longText} ${address.street}`;
      } else {
        address.street = c.longText;
      }
    }
    if (c.types.includes('street_number')) {
      if (address.street) {
        address.street = `${address.street} ${c.longText}`;
      } else {
        address.street = c.longText;
      }
    }
    if (c.types.includes('postal_town')) {
      address.town = c.longText;
    }
    if (c.types.includes('postal_code')) {
      address.zipcode = c.longText;
    }
  });

  return address;
};

export {
  addressFromPosition,
  addressesFromPosition,
  addressResultName,
  addressResultKey,
  addressResultToAddressObject,
  placesFromPosition,
  placeResultName,
  placeResultType,
  placeResultKey,
  placeResultFormattedAddress,
  placeResultToAddressObject,
};
