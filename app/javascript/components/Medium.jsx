import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import GridObjects from './GridObjects';
import {
  apiUrl, setMapping, showObject, webUrl,
} from './Mappings';

setMapping('Medium', 'oneName', 'medium');
setMapping('Medium', 'manyName', 'media');

function OneLine(props) {
  const { object: medium } = props;

  return (
    <div
      style={{
        width: '110px',
        height: '110px',
      }}
    >
      <img
        src={apiUrl('Medium', medium.id, 'thumb')}
        alt={medium.file_name}
      />
    </div>
  );
}
OneLine.propTypes = {
  object: PropTypes.shape({
    file_name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

function Overview({ object: medium, currentUser, reload }) {
  const objectsInPicture = medium.positions_in_object.sort(
    (a, b) => a.position.x - b.position.x,
  ).map(({ object }) => {
    const ShowObject = showObject(object._type_);
    return (
      <ShowObject
        key={`${object._type_}_${object.id}`}
        object={object}
        mode="oneLineLinked"
      />
    );
  }).flatMap((e) => [e, ', ']).slice(0, -1);
  if (objectsInPicture.length > 2) {
    objectsInPicture[objectsInPicture.length - 2] = ' och ';
  }

  if (medium.related.events.length > 0) {
    if (objectsInPicture.length > 0) {
      objectsInPicture.push(', ');
    }
    const ShowObject = showObject('Event');
    objectsInPicture.push(...medium.related.events.map((event) => (
      <ShowObject
        key={`${event._type_}_${event.id}`}
        object={event}
        mode="oneLineLinked"
      />
    )));
  }

  if (medium.related.addresses.length > 0) {
    if (objectsInPicture.length > 0) {
      objectsInPicture.push(', ');
    }
    const ShowObject = showObject('Address');
    objectsInPicture.push(...medium.related.addresses.map((address) => (
      <ShowObject
        key={`${address._type_}_${address.id}`}
        object={address}
        mode="oneLineLinked"
      />
    )));
  }

  if (medium.related.event_dates.length > 0) {
    if (objectsInPicture.length > 0) {
      objectsInPicture.push(', ');
    }
    const ShowObject = showObject('EventDate');
    objectsInPicture.push(...medium.related.event_dates.map((eventDate) => (
      <ShowObject
        key={`${eventDate._type_}_${eventDate.id}`}
        object={eventDate}
        mode="oneLine"
      />
    )));
  }

  if (objectsInPicture.length > 0) {
    objectsInPicture.push('.');
  }

  if (medium.related.notes.length > 0) {
    const ShowObject = showObject('Note');
    objectsInPicture.push(...medium.related.notes.map((note) => (
      <ShowObject
        key={`${note._type_}_${note.id}`}
        object={note}
        mode="full"
        currentUser={currentUser}
        reload={reload}
      />
    )));
  }

  return objectsInPicture;
}

Overview.propTypes = {
  object: PropTypes.shape({
    positions_in_object: PropTypes.arrayOf(PropTypes.shape({})),
    related: PropTypes.shape(),
  }).isRequired,
  currentUser: PropTypes.shape(),
  reload: PropTypes.func,
};

class Medium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      naturalSize: false,
      naturalWidth: null,
      naturalHeight: null,
      windowWidth: null,
      windowHeight: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHeights);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeights);
  }

  updateHeights = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  onImgLoad = (event) => {
    const {
      naturalWidth, naturalHeight,
    } = event.target;
    this.setState({
      naturalWidth,
      naturalHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  render() {
    const showTag = (event) => {
      const { target } = event;
      const { children } = target;
      target.style.border = 'black solid 1px';
      for (let i = 0; i < children.length; i += 1) {
        children[i].style.display = 'block';
      }
    };

    const hideTag = (event) => {
      const { target } = event;
      const { children } = target;
      target.style.border = 'none';
      for (let i = 0; i < children.length; i += 1) {
        children[i].style.display = 'none';
      }
    };

    const {
      currentUser, mode, parent, object: medium, reload,
    } = this.props;

    const { naturalSize } = this.state;

    if (mode === 'overview') {
      return (
        <Overview
          object={medium}
          currentUser={currentUser}
          reload={reload}
        />
      );
    }

    if (mode === 'oneLine') {
      return (
        <OneLine object={medium} />
      );
    }

    if (mode === 'oneLineLinked') {
      return (
        <Link to={webUrl('Medium', medium.id)}>
          <OneLine object={medium} />
        </Link>
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
              src={apiUrl('Medium', medium.id, 'image')}
              alt={medium.file_name}
              onLoad={this.onImgLoad}
            />
          </div>
        );
      } else {
        modalWidth = naturalWidth;
        let imgWidth = naturalWidth;
        let imgHeight = naturalHeight;
        const { windowWidth, windowHeight } = this.state;

        if (!naturalSize) {
          if (imgWidth > windowWidth) {
            imgHeight = (imgHeight * windowWidth) / imgWidth;
            imgWidth = windowWidth;
            modalWidth = imgWidth;
          }

          if (imgHeight > windowHeight / 2) {
            const targetHeight = windowHeight / 2;
            imgWidth = (imgWidth * targetHeight) / imgHeight;
            imgHeight = targetHeight;
            modalWidth = imgWidth;
          }
        }
        // FIXME: Decide what to do with modalWidth
        modalWidth = null;

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
              onMouseOver={showTag}
              onFocus={showTag}
              onMouseOut={hideTag}
              onBlur={hideTag}
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
                src={apiUrl('Medium', medium.id, 'image')}
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
        parent={parent}
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
  }
}

Medium.propTypes = {
  parent: PropTypes.shape(),
  object: PropTypes.shape({
    id: PropTypes.number,
    file_name: PropTypes.string,
    positions_in_object: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({}),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

Medium.defaultProps = {
  parent: null,
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('Medium', 'showObject', Medium);

function ShowMedia(props) {
  const {
    mode, parent, objects, currentUser, reload,
  } = props;
  return (
    <GridObjects
      _type_="Medium"
      parent={parent}
      objects={objects}
      mode={mode}
      currentUser={currentUser}
      reload={reload}
    />
  );
}

ShowMedia.propTypes = {
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape().isRequired,
  reload: PropTypes.func.isRequired,
};

ShowMedia.defaultProps = {
  mode: '',
  parent: null,
  objects: [],
};

setMapping('Medium', 'showObjects', ShowMedia);

function IndexMedium() {
  return (
    <Index
      _type_="Medium"
    />
  );
}

function ShowMedium() {
  return (
    <Show
      _type_="Medium"
    />
  );
}

function VersionMedium() {
  return (
    <Version
      _type_="Medium"
    />
  );
}

export { IndexMedium, ShowMedium, VersionMedium };
