import React from 'react';
import PropTypes from 'prop-types';
import Image from './Image';

const isImage = (contentType) => {
  if (contentType.startsWith('image/')) {
    return true;
  }
  return false;
};

const isPdf = (contentType) => {
  if (contentType === 'application/pdf') {
    return true;
  }
  return false;
};

function DisplayMedium({
  alt, src, contentType, link, onResize = null,
}) {
  if (isImage(contentType)) {
    return (
      <Image
        src={src}
        alt={alt}
        clickToResize
        onResize={onResize}
      />
    );
  }

  if (isPdf(contentType)) {
    return (
      <a
        href={link}
      >
        <Image
          src={src}
          alt={alt}
          onResize={onResize}
        />
      </a>
    );
  }

  return (
    <a
      href={link}
    >
      <Image
        src={src}
        alt={alt}
        onResize={onResize}
      />
    </a>
  );
}

DisplayMedium.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  onResize: PropTypes.func,
};

export default DisplayMedium;
