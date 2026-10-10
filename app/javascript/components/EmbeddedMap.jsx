import React from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, Marker, Tooltip, CircleMarker, Popup,
} from 'react-leaflet';
import Config from './Config';

function EmbeddedMap(props) {
  const {
    markers, latitude, longitude, tooltip, width, height,
  } = props;
  const { publicApiKey: apiKey } = Config.google;

  let mainMarkerElement = null;
  let position = null;

  if ((latitude != null) && (longitude != null)) {
    position = [latitude, longitude];
    let tooltipElement = null;
    if (tooltip != null) {
      tooltipElement = (
        <Tooltip>
          {tooltip}
        </Tooltip>
      );
    }
    mainMarkerElement = (
      <CircleMarker center={position} radius="10">
        {tooltipElement}
      </CircleMarker>
    );
  }

  let markerElements = null;
  if ((markers != null) && (markers.length > 0)) {
    if (position == null) {
      position = [markers[0].latitude, markers[0].longitude];
    }
    markerElements = markers.map((marker) => {
      let tooltipElement = null;
      if (marker.tooltip != null) {
        tooltipElement = (
          <Tooltip>
            {marker.tooltip}
          </Tooltip>
        );
      }
      let popupElement = null;
      if (marker.popup != null) {
        popupElement = (
          <Popup>
            {marker.popup}
          </Popup>
        );
      }
      return (
        <Marker position={[marker.latitude, marker.longitude]} key={marker.key}>
          {tooltipElement}
          {popupElement}
        </Marker>
      );
    });
  }

  if ((mainMarkerElement != null) || (markerElements != null)) {
    return (
      <>
        <div style={{ height, width }}>
          <MapContainer center={position} zoom={20} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mainMarkerElement}
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
      width={width}
      height={height}
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
  width: PropTypes.string,
  height: PropTypes.string,
};

EmbeddedMap.defaultProps = {
  markers: null,
  location: null,
  latitude: null,
  longitude: null,
  tooltip: null,
  width: '600px',
  height: '450px',
};

export default EmbeddedMap;
