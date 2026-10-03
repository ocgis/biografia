import React from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, Marker, Tooltip, CircleMarker,
} from 'react-leaflet';
import Config from './Config';

function EmbeddedMap(props) {
  const {
    markers, latitude, longitude, tooltip,
  } = props;
  const { publicApiKey: apiKey } = Config.google;

  if ((latitude != null) && (longitude != null)) {
    const position = [latitude, longitude];
    let tooltipElement = null;
    if (tooltip != null) {
      tooltipElement = (
        <Tooltip>
          {tooltip}
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
          <CircleMarker center={position} radius="10">
            {tooltipElement}
          </CircleMarker>
        </MapContainer>
      </div>
    );
  }

  if ((markers != null) && (markers.length > 0)) {
    const position = [markers[0].latitude, markers[0].longitude];
    const markerElements = markers.map((marker) => {
      let tooltipElement = null;
      if (marker.tooltip != null) {
        tooltipElement = (
          <Tooltip>
            {marker.tooltip}
          </Tooltip>
        );
      }
      return (
        <Marker position={[marker.latitude, marker.longitude]}>
          {tooltipElement}
        </Marker>
      );
    });
    return (
      <>
        {`${position[0]}, ${position[1]}`}
        <div style={{ height: '450px', width: '600px' }}>
          <MapContainer center={position} zoom={20} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerElements}
          </MapContainer>
        </div>
      </>
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
  markers: PropTypes.arrayOf(PropTypes.shape()),
  location: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  tooltip: PropTypes.element,
};

EmbeddedMap.defaultProps = {
  markers: null,
  location: null,
  latitude: null,
  longitude: null,
  tooltip: null,
};

export default EmbeddedMap;
