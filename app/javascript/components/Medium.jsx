import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import { setMapping, webUrl } from './Mappings';

setMapping('Medium', 'oneName', 'medium');
setMapping('Medium', 'manyName', 'media');

const OneLine = (props) => {
  const { object: medium } = props;

  return (
    <div
      style={{
        width: '110px',
        height: '110px',
      }}
    >
      <img
        src={`/media/${medium.id}/thumb`}
        alt={medium.file_name}
      />
    </div>
  );
};

OneLine.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

class Medium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      naturalSize: false,
      naturalWidth: null,
      naturalHeight: null,
    };
  }

  onImgLoad = (event) => {
    const {
      naturalWidth, naturalHeight,
    } = event.target;
    this.setState({
      naturalWidth,
      naturalHeight,
    });
  }

  showTag = (event) => {
    const { target } = event;
    const { children } = target;
    target.style.border = 'black solid 1px';
    for (let i = 0; i < children.length; i += 1) {
      children[i].style.display = 'block';
    }
  }

  hideTag = (event) => {
    const { target } = event;
    const { children } = target;
    target.style.border = 'none';
    for (let i = 0; i < children.length; i += 1) {
      children[i].style.display = 'none';
    }
  }

  render = () => {
    const {
      currentUser, mode, object: medium, reload,
    } = this.props;

    const { naturalSize } = this.state;

    if (mode === 'oneLine') {
      return (
        <OneLine object={medium} />
      );
    }

    let modalWidth = null;
    let mediaTag = null;

    if (mode === 'full') {
      const { naturalWidth, naturalHeight } = this.state;

      if (naturalWidth == null || naturalHeight == null) {
        mediaTag = (
          <div style={{ position: 'relative' }}>
            <img
              src={`/media/${medium.id}/image`}
              alt={medium.file_name}
              onLoad={this.onImgLoad}
            />
          </div>
        );
      } else {
        modalWidth = naturalWidth;
        let imgWidth = naturalWidth;
        let imgHeight = naturalHeight;

        if (!naturalSize) {
          if (imgWidth > window.innerWidth) {
            imgHeight = (imgHeight * window.innerWidth) / imgWidth;
            imgWidth = window.innerWidth;
            modalWidth = imgWidth;
          }

          if (imgHeight > window.innerHeight) {
            imgWidth = (imgWidth * window.innerHeight) / imgHeight;
            imgHeight = window.innerHeight;
            modalWidth = imgWidth;
          }
        }

        const positionTags = medium.positions_in_object.map((pio) => {
          const x = (pio.position.x * imgWidth) / 1000;
          const y = (pio.position.y * imgHeight) / 1000;
          const width = (pio.position.width * imgWidth) / 1000;
          const height = (pio.position.height * imgHeight) / 1000;
          return (
            <span
              style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onMouseOver={this.showTag}
              onFocus={this.showTag}
              onMouseOut={this.hideTag}
              onBlur={this.hideTag}
              key={pio.position.id}
            >
              <span style={{
                position: 'absolute',
                bottom: '0px',
                left: '0px',
                width: '100%',
                backgroundColor: 'blue',
                display: 'none',
              }}
              >
                {pio.object.name}
              </span>
            </span>
          );
        });
        mediaTag = (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => this.setState({ naturalSize: !naturalSize })}
              style={{
                border: 'none',
                padding: 0,
              }}
            >
              <img
                src={`/media/${medium.id}/image`}
                alt={medium.file_name}
                width={imgWidth}
                height={imgHeight}
              />
            </button>
            { positionTags }
          </div>
        );
      }
    } else {
      mediaTag = (
        <Link to={webUrl('Medium', medium.id)}>
          <OneLine object={medium} />
        </Link>
      );
    }

    return (
      <Base
        object={medium}
        appendElements={mediaTag}
        modifierProps={{
          showAddAddress: true,
          showAddEvent: true,
          showAddEventDate: true,
          showAddNote: true,
          showAddPerson: true,
          showAddThing: true,
          showTagMedium: true,
        }}
        modalWidth={modalWidth}
        currentUser={currentUser}
        reload={reload}
      />
    );
  };
}

Medium.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Medium.defaultProps = {
  mode: '',
};

setMapping('Medium', 'showObject', Medium);

const IndexMedium = () => (
  <Index
    _type_="Medium"
  />
);

const ShowMedium = () => (
  <Show
    _type_="Medium"
  />
);

const VersionMedium = () => (
  <Version
    _type_="Medium"
  />
);

export { IndexMedium, ShowMedium, VersionMedium };
