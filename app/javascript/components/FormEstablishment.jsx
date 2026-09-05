import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { EnterOutlined, ReloadOutlined } from '@ant-design/icons';
import FormAddress from './FormAddress';
import {
  placesFromPosition,
  placeResultToAddressObject,
  placeResultName,
  placeResultType,
  placeResultFormattedAddress,
  placeResultKey,
} from './Geocoding';

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

function EstablishmentHints(props) {
  let initHintsFetched = true;
  const { onSelect, referFrom } = props;
  if (referFrom != null) {
    if (referFrom.related != null) {
      if (referFrom.related.addresses.length > 0) {
        initHintsFetched = false;
      }
    }
  }

  const [hintsFetched, setHintsFetched] = useState(initHintsFetched);
  const [places, setPlaces] = useState([]);

  const loadHints = () => {
    referFrom.related.addresses.forEach((address) => {
      if ((address.latitude != null) && (address.longitude != null)) {
        placesFromPosition(address.latitude, address.longitude, (p) => setPlaces(places.concat(p)));
      }
    });
    setHintsFetched(true);
  };

  if (!hintsFetched) {
    return (
      <ReloadOutlined
        onClick={() => loadHints()}
      />
    );
  }

  return (
    <PresentHints places={places} onSelect={onSelect} />
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
