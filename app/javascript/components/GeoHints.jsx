import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { EnterOutlined } from '@ant-design/icons';
import { getPrimaryPosition } from './Position';
import EmbeddedMap from './EmbeddedMap';
import { showObject } from './Mappings';

const getInitialCenter = (referFrom) => {
  if (referFrom != null) {
    const referFromPosition = getPrimaryPosition(referFrom);
    if (referFromPosition != null) {
      return { latitude: referFromPosition.latitude, longitude: referFromPosition.longitude };
    }
  }
  return { latitude: 57.7, longitude: 12 };
};

function MapHints(props) {
  const {
    referFrom, markers, onMapMove,
  } = props;

  const position = getInitialCenter(referFrom);
  let tooltip = null;
  if (referFrom != null) {
    const ShowReferFromObject = showObject(referFrom._type_);
    tooltip = <ShowReferFromObject object={referFrom} mode="oneLine" />;
  }
  return (
    <EmbeddedMap
      latitude={position.latitude}
      longitude={position.longitude}
      tooltip={tooltip}
      markers={markers}
      onMapMove={onMapMove}
    />
  );
}
MapHints.propTypes = {
  referFrom: PropTypes.shape().isRequired,
  markers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onMapMove: PropTypes.func,
};
MapHints.defaultProps = {
  onMapMove: null,
};

function ListHint(props) {
  const { hint, onSelect } = props;
  return (
    <div>
      { hint.text }
      <EnterOutlined onClick={() => onSelect(hint)} />
    </div>
  );
}
ListHint.propTypes = {
  hint: PropTypes.shape().isRequired,
  onSelect: PropTypes.func.isRequired,
};

function ListHints(props) {
  const { hints, onSelect } = props;
  const listHints = hints.map((hint) => (
    <ListHint key={hint.key} hint={hint} onSelect={onSelect} />
  ));
  return listHints;
}
ListHints.propTypes = {
  hints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function HintTabs(props) {
  const {
    onSelect, referFrom, setCurrentCenter, listHints, mapHints,
  } = props;
  const tabItems = [
    {
      key: 'List',
      label: 'Lista',
      children: <ListHints hints={listHints} onSelect={(listHint) => onSelect(listHint.place)} />,
    },
    {
      key: 'Map',
      label: 'Karta',
      children: (
        <MapHints
          referFrom={referFrom}
          markers={mapHints}
          onMapMove={setCurrentCenter}
        />
      ),
    },
  ];
  return <Tabs defaultActiveKey={tabItems[0].key} items={tabItems} />;
}
HintTabs.propTypes = {
  referFrom: PropTypes.shape(),
  onSelect: PropTypes.func.isRequired,
  setCurrentCenter: PropTypes.func.isRequired,
  listHints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  mapHints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
HintTabs.defaultProps = {
  referFrom: null,
};

export {
  HintTabs, getInitialCenter,
};
