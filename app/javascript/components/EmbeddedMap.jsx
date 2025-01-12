import React from 'react';
import PropTypes from 'prop-types';
import Config from './Config';

function EmbeddedMap(props) {
  const { location } = props;
  const { publicApiKey: apiKey, attributionUrl } = Config.google;
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
  location: PropTypes.string.isRequired,
};

export default EmbeddedMap;
