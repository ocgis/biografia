import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modifier, VersionInfo } from './Common';

const OneLine = (props) => {
  const { object: address } = props;

  const parts = [];

  if (address.street != null) {
    parts.push(address.street);
  }

  if (address.town != null) {
    parts.push(address.town);
  }

  if (address.parish != null) {
    parts.push(`${address.parish} församling`);
  }

  if (parts.size === 0 && address.latitude != null && address.longitude != null) {
    parts.push(`${address.latitude},${address.longitude}`);
  }
  if (parts.size === 0) {
    return 'Empty address';
  }

  return parts.join(', ');
};

const Address = (props) => {
  const { object: address } = props;
  const { currentUser } = props;
  const { showFull } = props;

  let name = null;
  if (showFull) {
    name = (
      <OneLine object={address} />
    );
  } else {
    name = (
      <Link to={`/r/addresses/${address.id}`}>
        <OneLine object={address} />
      </Link>
    );
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {name}
            </td>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={address} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Address.propTypes = {
  object: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Address.defaultProps = {
  showFull: false,
};

Address.OneLine = OneLine;

export default Address;
