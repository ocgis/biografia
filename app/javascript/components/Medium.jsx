import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditMedium from './EditMedium';
import GridObjects from './GridObjects';
import DisplayMedium from './DisplayMedium';
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
      imgWidth: null,
      imgHeight: null,
    };
  }

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
      const { context } = this.props;
      return (
        <Link to={webUrl('Medium', medium.id)} state={{ context }}>
          <OneLine object={medium} />
        </Link>
      );
    }

    let mediaTag = null;

    if (mode === 'full') {
      const { imgWidth, imgHeight } = this.state;
      let positionTags = [];

      if (imgWidth != null && imgHeight != null) {
        positionTags = medium.positions_in_object.map((pio) => {
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
      }
      mediaTag = (
        <div style={{ position: 'relative' }}>
          <DisplayMedium
            src={apiUrl('Medium', medium.id, 'image')}
            link={apiUrl('Medium', medium.id, 'raw')}
            alt={medium.file_name}
            contentType={medium.info.content_type}
            onResize={(width, height) => {
              this.setState({
                imgWidth: width,
                imgHeight: height,
              });
            }}
          />
          { positionTags }
        </div>
      );
    } else {
      const { context } = this.props;
      mediaTag = (
        <Link to={webUrl('Medium', medium.id)} state={{ context }}>
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
    info: PropTypes.shape({
      content_type: PropTypes.string.isRequired,
    }),
  }).isRequired,
  context: PropTypes.shape(),
  currentUser: PropTypes.shape({}),
  reload: PropTypes.func,
  mode: PropTypes.string,
};

Medium.defaultProps = {
  parent: null,
  context: null,
  currentUser: null,
  mode: '',
  reload: null,
};

setMapping('Medium', 'showObject', Medium);
setMapping('Medium', 'editObject', EditMedium);

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
