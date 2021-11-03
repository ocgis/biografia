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
import Thing from './Thing';

const { TabPane } = Tabs;

const RenderElement = (props) => {
  const {
    currentUser, element, kind, reload,
  } = props;

  const componentMap = {
    addresses: Address,
    event_dates: EventDate,
    events: Event,
    media: Medium,
    notes: Note,
    people: Person,
    relationships: Relationship,
    things: Thing,
  };
  const Component = componentMap[kind];

  if (Component == null) {
    console.log(kind, element);
    return null;
  }

  return (
    <Component object={element} currentUser={currentUser} reload={reload} />
  );
};

RenderElement.propTypes = {
  kind: PropTypes.string.isRequired,
  element: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
};

const ShowReferences = (props) => {
  const { currentUser, related, reload } = props;
  const tabHeader = (key) => {
    const header = {
      people: 'Personer',
      events: 'Händelser',
      event_dates: 'Datum',
      notes: 'Kommentarer',
      relationships: 'Förhållanden',
      media: 'Media',
      addresses: 'Adresser',
      things: 'Saker',
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
                  reload={reload}
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
    reload: PropTypes.func,
  }).isRequired,
  reload: PropTypes.func,
  currentUser: PropTypes.shape({}).isRequired,
};
ShowReferences.defaultProps = {
  reload: () => alert('Missing reload callback'),
};

export { ShowReferences };
