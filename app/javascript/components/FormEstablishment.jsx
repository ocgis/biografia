import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Tabs } from 'antd';
import { EnterOutlined, ReloadOutlined } from '@ant-design/icons';
import FormAddress from './FormAddress';
import {
  placesFromPosition,
  placeResultToAddressObject,
  placeResultName,
  placeResultType,
  placeResultFormattedAddress,
  placeResultKey,
  placeResultPosition,
} from './Geocoding';
import { getPrimaryPosition } from './Position';
import EmbeddedMap from './EmbeddedMap';
import { showObject } from './Mappings';

function PresentHint(props) {
  const { place, onSelect } = props;
  let hintText = placeResultName(place);
  const typeText = placeResultType(place);
  if (typeText) {
    hintText += ` (${typeText})`;
  }
  hintText += `, ${placeResultFormattedAddress(place)}`;
  return (
    <div>
      { hintText }
      <EnterOutlined onClick={() => onSelect(place)} />
    </div>
  );
}
PresentHint.propTypes = {
  place: PropTypes.shape().isRequired,
  onSelect: PropTypes.func.isRequired,
};

function IncludeTypes(props) {
  const onTypeSelectChange = (value) => {
    const { onChange } = props;
    onChange(value);
  };

  const options = [
    { label: 'Arenor', value: 'arena' },
    { label: 'Flygplatser', value: 'airport' },
    { label: 'Hotell', value: 'hotel' },
    { label: 'Nöjesparker', value: 'amusement_park' },
    { label: 'Parker', value: 'park' },
    { label: 'Restauranger', value: 'restaurant' },
    { label: 'Skidorter', value: 'ski_resort' },
    { label: 'Turistattraktioner', value: 'tourist_attraction' },
  ];

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: '20em' }}
      options={options}
      onChange={onTypeSelectChange}
      placeholder="Filtrera på typ"
    />
  );
}
IncludeTypes.propTypes = {
  onChange: PropTypes.func.isRequired,
};

function PresentHints(props) {
  const { places, onSelect } = props;
  const hints = places.map((place) => (
    <PresentHint key={placeResultKey(place)} place={place} onSelect={onSelect} />
  ));
  return hints;
}
PresentHints.propTypes = {
  places: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function placeToMarker(place, onSelect) {
  const position = placeResultPosition(place);
  let placeName = placeResultName(place);
  const typeText = placeResultType(place);
  if (typeText) {
    placeName += ` (${typeText})`;
  }
  const address = placeResultFormattedAddress(place);
  return {
    latitude: position.latitude,
    longitude: position.longitude,
    tooltip: (
      <>
        {placeName}
        <br />
        {address}
      </>
    ),
    popup: <EnterOutlined onClick={() => onSelect(place)} />,
  };
}

function MapHints(props) {
  const {
    referFrom, places, onSelect,
  } = props;
  const ShowReferFromObject = showObject(referFrom._type_);
  const tooltip = <ShowReferFromObject object={referFrom} mode="oneLine" />;
  const markers = places.map((place) => placeToMarker(place, onSelect));
  const referFromPosition = getPrimaryPosition(referFrom);
  return (
    <EmbeddedMap
      latitude={referFromPosition.latitude}
      longitude={referFromPosition.longitude}
      tooltip={tooltip}
      markers={markers}
    />
  );
}
MapHints.propTypes = {
  referFrom: PropTypes.shape().isRequired,
  places: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function EstablishmentHints(props) {
  const { onSelect, referFrom } = props;
  const [places, setPlaces] = useState([]);
  const [includeTypes, setIncludeTypes] = useState([]);

  const loadHints = () => {
    const referFromPosition = getPrimaryPosition(referFrom);

    if (referFromPosition != null) {
      placesFromPosition(
        referFromPosition.latitude,
        referFromPosition.longitude,
        includeTypes,
        (p) => setPlaces(p),
      );
    }
  };

  const tabItems = [
    {
      key: 'List',
      label: 'Lista',
      children: <PresentHints places={places} onSelect={onSelect} />,
    },
    {
      key: 'Map',
      label: 'Karta',
      children: <MapHints referFrom={referFrom} places={places} onSelect={onSelect} />,
    },
  ];
  return (
    <>
      <ReloadOutlined
        onClick={() => loadHints()}
      />
      <IncludeTypes onChange={setIncludeTypes} />
      <Tabs defaultActiveKey={tabItems[0].key} items={tabItems} />
    </>
  );
}
EstablishmentHints.propTypes = {
  referFrom: PropTypes.shape(),
  onSelect: PropTypes.func.isRequired,
};
EstablishmentHints.defaultProps = {
  referFrom: null,
};

function EstablishmentFields(props) {
  const { establishment, onChange } = props;
  return (
    <table>
      <tbody>
        <tr>
          <td>
            Namn:
          </td>
          <td aria-label="Name">
            <Input
              value={establishment.name}
              onChange={(event) => {
                establishment.name = event.target.value;
                onChange({ establishment });
              }}
            />
          </td>
        </tr>
        <tr>
          <td>
            Typ:
          </td>
          <td aria-label="Kind">
            <Input
              value={establishment.kind}
              onChange={(event) => {
                establishment.kind = event.target.value;
                onChange({ establishment });
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
EstablishmentFields.propTypes = {
  establishment: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
};

class FormEstablishment extends React.Component {
  constructor(props) {
    super(props);
    const { object: establishment } = props;
    this.state = {
      establishment: {
        ...JSON.parse(JSON.stringify(establishment)),
        related: {
          addresses: [
            {
            },
          ],
        },
      },
      /* referFrom: null, */
    };
  }

  render() {
    const { onChange, referFrom } = this.props;
    const { establishment } = this.state;
    const { related: { addresses: [address] } } = establishment;

    return (
      <table>
        <tbody>
          <tr>
            <td aria-label="establishment" valign="top">
              <EstablishmentFields
                establishment={establishment}
                onChange={(object) => {
                  onChange(object);
                  this.setState(object);
                }}
              />
            </td>
            <td aria-label="address" valign="top">
              <FormAddress
                onChange={(newAddress) => {
                  establishment.related.addresses[0] = newAddress.address;
                  onChange({ establishment });
                  this.setState({ establishment });
                }}
                object={address}
              />
            </td>
            <td aria-label="hints" valign="top">
              <EstablishmentHints
                referFrom={referFrom}
                onSelect={(object) => {
                  const newEstablishment = {
                    ...establishment,
                    name: placeResultName(object),
                    kind: placeResultType(object),
                    related: {
                      addresses: [
                        placeResultToAddressObject(object),
                      ],
                    },
                  };
                  onChange({
                    establishment: newEstablishment,
                  });
                  this.setState({
                    establishment: newEstablishment,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
FormEstablishment.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape(),
};
FormEstablishment.defaultProps = {
  object: {
    name: null,
    kind: null,
  },
  referFrom: null,
};

export default FormEstablishment;
