import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import {
  setMapping, showObject, showObjects,
} from './Mappings';

setMapping('Reference', 'oneName', 'reference');
setMapping('Reference', 'manyName', 'references');

const { TabPane } = Tabs;

function RenderElement(props) {
  const {
    currentUser, element, kind, reload,
  } = props;

  const Component = showObject(kind);

  if (Component == null) {
    return null;
  }

  return (
    <Component object={element} currentUser={currentUser} reload={reload} />
  );
}

RenderElement.propTypes = {
  kind: PropTypes.string.isRequired,
  element: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  reload: PropTypes.func.isRequired,
};

function ShowReferences(props) {
  const {
    currentUser, object, object: { related }, reload,
  } = props;
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

  const ShowObject = showObject(object._type_);

  return (
    <Tabs>
      <TabPane tab="Översikt" key="overview">
        <ShowObject
          mode="overview"
          object={object}
          currentUser={currentUser}
          reload={reload}
        />
      </TabPane>
      {Object.keys(related).map((key) => {
        if (related[key].length > 0) {
          const ShowObjects = showObjects(key);

          return (
            <TabPane tab={tabHeader(key)} key={key}>
              <ShowObjects
                objects={related[key]}
                reload={reload}
                currentUser={currentUser}
              />
            </TabPane>
          );
        }
        return null;
      })}
    </Tabs>
  );
}

ShowReferences.propTypes = {
  object: PropTypes.shape().isRequired,
  /* related: PropTypes.shape({
   *   notes: PropTypes.arrayOf(PropTypes.shape({})),
   * }).isRequired, */
  reload: PropTypes.func,
  currentUser: PropTypes.shape({}).isRequired,
};
ShowReferences.defaultProps = {
  reload: () => alert('Missing reload callback'),
};

/* eslint-disable import/prefer-default-export */
export { ShowReferences };
