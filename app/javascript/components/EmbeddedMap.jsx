import React from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, Marker, Tooltip,
} from 'react-leaflet';
import Config from './Config';

function EmbeddedMap(props) {
  const { latitude, longitude, description } = props;
  const { publicApiKey: apiKey } = Config.google;

  if ((latitude != null) && (longitude != null)) {
    const position = [latitude, longitude];
    let tooltip = null;
    if (description != null) {
      tooltip = (
        <Tooltip>
          {description}
        </Tooltip>
      );
    }
    return (
      <div style={{ height: '450px', width: '600px' }}>
        <MapContainer center={position} zoom={20} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            {tooltip}
          </Marker>
        </MapContainer>
      </div>
    );
  }

  const { location } = props;
  const { attributionUrl } = Config.google;
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location}&attribution_source=Google+Maps+Embed+API&attribution_web_url=${attributionUrl}&attribution_ios_deep_link_id=comgooglemaps://?daddr=#{location}`;

  return (
    <iframe
      title={location}
      width="600"
      height="450"
      frameBorder="0"
      style={{ border: 0 }}
      src={src}
    />
  );
}

EmbeddedMap.propTypes = {
  location: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  description: PropTypes.element,
};

EmbeddedMap.defaultProps = {
  location: null,
  latitude: null,
  longitude: null,
  description: null,
};

export default EmbeddedMap;
