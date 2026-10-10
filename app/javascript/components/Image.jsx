import React from 'react';
import PropTypes from 'prop-types';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      largeSize: false,
      naturalWidth: null,
      naturalHeight: null,
      imgWidth: null,
      imgHeight: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const { largeSize, naturalWidth, naturalHeight } = this.state;
    this.updateHeights(largeSize, naturalWidth, naturalHeight);
  };

  onClick = () => {
    const { largeSize, naturalWidth, naturalHeight } = this.state;
    this.updateHeights(!largeSize, naturalWidth, naturalHeight);
  };

  updateHeights = (largeSize, naturalWidth, naturalHeight) => {
    const { onResize } = this.props;
    let imgWidth = naturalWidth;
    let imgHeight = naturalHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxFactor = largeSize ? 1 : 0.5;

    if (imgWidth > windowWidth) {
      imgHeight = (imgHeight * windowWidth) / imgWidth;
      imgWidth = windowWidth;
    }

    if (imgHeight > windowHeight * maxFactor) {
      const targetHeight = windowHeight * maxFactor;
      imgWidth = (imgWidth * targetHeight) / imgHeight;
      imgHeight = targetHeight;
    }

    this.setState({
      largeSize,
      naturalWidth,
      naturalHeight,
      imgWidth,
      imgHeight,
    });
    if (onResize != null) {
      onResize(imgWidth, imgHeight);
    }
  };

  onImgLoad = (event) => {
    const {
      naturalWidth, naturalHeight,
    } = event.target;
    const { largeSize } = this.state;
    this.updateHeights(largeSize, naturalWidth, naturalHeight);
  };

  render() {
    const { clickToResize, src, alt } = this.props;
    const { imgWidth, imgHeight } = this.state;

    if (imgWidth == null || imgHeight == null) {
      return (
        <div style={{ position: 'relative' }}>
          <img
            src={src}
            alt={alt}
            onLoad={this.onImgLoad}
          />
        </div>
      );
    }

    if (clickToResize) {
      return (
        <button
          type="button"
          onClick={this.onClick}
          style={{
            border: 'none',
            padding: 0,
          }}
        >
          <img
            src={src}
            alt={alt}
            width={imgWidth}
            height={imgHeight}
          />
        </button>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
      />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  clickToResize: PropTypes.bool,
  onResize: PropTypes.func,
};

Image.defaultProps = {
  clickToResize: false,
  onResize: null,
};

export default Image;
