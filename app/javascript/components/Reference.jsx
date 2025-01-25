import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import {
  setMapping, showObject, showObjects,
} from './Mappings';

setMapping('Reference', 'oneName', 'reference');
setMapping('Reference', 'manyName', 'references');

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
    currentUser, object, object: { related }, reload, state, setState,
  } = props;
  const tabHeader = (key) => {
    const header = {
      people: 'Personer',
      establishments: 'Ställen',
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

  const onChange = (key) => {
    setState({ activeKey: key });
  };

  const ShowObject = showObject(object._type_);

  const tabItems = [{
    key: 'overview',
    label: 'Översikt',
    children: (
      <ShowObject
        mode="overview"
        object={object}
        currentUser={currentUser}
        reload={reload}
      />
    ),
  }].concat(Object.keys(related).filter((key) => related[key].length > 0).map((key) => {
    const ShowObjects = showObjects(key);

    return ({
      key,
      label: tabHeader(key),
      children: (
        <ShowObjects
          parent={object}
          objects={related[key]}
          reload={reload}
          currentUser={currentUser}
        />
      ),
    });
  }));

  return (
    <Tabs
      onChange={onChange}
      activeKey={state.activeKey || 'overview'}
      items={tabItems}
    />
  );
}

ShowReferences.propTypes = {
  object: PropTypes.shape().isRequired,
  /* related: PropTypes.shape({
   *   notes: PropTypes.arrayOf(PropTypes.shape({})),
   * }).isRequired, */
  reload: PropTypes.func,
  currentUser: PropTypes.shape({}).isRequired,
  state: PropTypes.shape().isRequired,
  setState: PropTypes.func.isRequired,
};
ShowReferences.defaultProps = {
  reload: () => alert('Missing reload callback'),
};

/* eslint-disable import/prefer-default-export */
export { ShowReferences };
