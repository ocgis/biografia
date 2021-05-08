import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import Person from './Person';
import Event from './Event';
import Note from './Note';
import Relationship from './Relationship';
import Medium from './Medium';
import Address from './Address';
import EventDate from './EventDate';

const { TabPane } = Tabs;

const RenderElement = (props) => {
  const { kind } = props;
  const { element } = props;
  const { currentUser } = props;

  switch (kind) {
    case 'people':
      return (
        <Person object={element} currentUser={currentUser} />
      );

    case 'events':
      return (
        <Event object={element} currentUser={currentUser} />
      );

    case 'event_dates':
      return (
        <EventDate object={element} currentUser={currentUser} />
      );

    case 'notes':
      return (
        <Note object={element} currentUser={currentUser} />
      );

    case 'relationships':
      return (
        <Relationship object={element} currentUser={currentUser} />
      );

    case 'media':
      return (
        <Medium object={element} currentUser={currentUser} />
      );

    case 'addresses':
      return (
        <Address object={element} currentUser={currentUser} />
      );

    default:
      console.log(kind, element);
      return null;
  }
};

RenderElement.propTypes = {
  kind: PropTypes.string.isRequired,
  element: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

const ShowReferences = (props) => {
  const { related } = props;
  const { currentUser } = props;
  const tabHeader = (key) => {
    const header = {
      people: 'Personer',
      events: 'Händelser',
      event_dates: 'Datum',
      notes: 'Kommentarer',
      relationships: 'Förhållanden',
      media: 'Media',
      addresses: 'Adresser',
    }[key];
    if (header == null) {
      return `Undefined: ${key}`;
    }
    return header;
  };

  return (
    <Tabs>
      {Object.keys(related).map((key) => {
        if (related[key].length > 0) {
          return (
            <TabPane tab={tabHeader(key)} key={key}>
              {related[key].map((element) => (
                <RenderElement
                  kind={key}
                  element={element}
                  key={element.id}
                  currentUser={currentUser}
                />
              ))}
            </TabPane>
          );
        }
        return null;
      })}
    </Tabs>
  );
};

ShowReferences.propTypes = {
  related: PropTypes.shape({
    notes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

export { ShowReferences };
