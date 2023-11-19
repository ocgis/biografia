import React from 'react';
import PropTypes from 'prop-types';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      naturalSize: false,
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
    const { naturalSize, naturalWidth, naturalHeight } = this.state;
    this.updateHeights(naturalSize, naturalWidth, naturalHeight);
  };

  onClick = () => {
    const { naturalSize, naturalWidth, naturalHeight } = this.state;
    this.updateHeights(!naturalSize, naturalWidth, naturalHeight);
  };

  updateHeights = (naturalSize, naturalWidth, naturalHeight) => {
    const { onResize } = this.props;
    let imgWidth = naturalWidth;
    let imgHeight = naturalHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (!naturalSize) {
      if (imgWidth > windowWidth) {
        imgHeight = (imgHeight * windowWidth) / imgWidth;
        imgWidth = windowWidth;
      }

      if (imgHeight > windowHeight / 2) {
        const targetHeight = windowHeight / 2;
        imgWidth = (imgWidth * targetHeight) / imgHeight;
        imgHeight = targetHeight;
      }
    }
    this.setState({
      naturalSize,
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
    const { naturalSize } = this.state;
    this.updateHeights(naturalSize, naturalWidth, naturalHeight);
  };

  render() {
    const { src, alt } = this.props;
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
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onResize: PropTypes.func,
};

Image.defaultProps = {
  onResize: null,
};

export default Image;
