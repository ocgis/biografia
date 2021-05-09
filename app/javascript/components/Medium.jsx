import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const OneLine = (props) => {
  const { object: medium } = props;

  return (
    <img src={`/media/${medium.id}/thumb`} alt={medium.file_name} />
  );
};

class Medium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: 1,
      imgWidth: 1,
    };
  }

  onImgLoad = (event) => {
    const { clientWidth: imgWidth, clientHeight: imgHeight } = event.target;
    this.setState({ imgWidth, imgHeight });
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
    const { object: medium } = this.props;
    const { currentUser } = this.props;
    const { showFull } = this.props;

    let mediaTag = null;

    if (showFull) {
      const positionTags = medium.positions_in_object.map((pio) => {
        const { imgWidth, imgHeight } = this.state;
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
          <img
            src={`/media/${medium.id}/image`}
            alt={medium.file_name}
            onLoad={this.onImgLoad}
          />
          { positionTags }
        </div>
      );
    } else {
      mediaTag = (
        <Link to={`/r/media/${medium.id}`}>
          <OneLine object={medium} />
        </Link>
      );
    }

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <Modifier currentUser={currentUser} />
              <td>
                <VersionInfo object={medium} />
              </td>
            </tr>
          </tbody>
        </table>
        {mediaTag}
        <br />
      </div>
    );
  };
}

Medium.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Medium.defaultProps = {
  showFull: false,
};

Medium.OneLine = OneLine;

export default Medium;
