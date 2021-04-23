import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { Person } from './Person';
import { Event } from './Event';
import { Note } from './Note';

const { TabPane } = Tabs;

const RenderElement = (props) => {
  const { kind } = props;
  const { element } = props;
  const { currentUser } = props;

  switch (kind) {
    case 'people':
      return (
        <Person person={element} currentUser={currentUser} />
      );

    case 'events':
      return (
        <Event event={element} currentUser={currentUser} />
      );

    case 'notes':
      return (
        <Note note={element} currentUser={currentUser} />
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
      notes: 'Kommentarer',
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
