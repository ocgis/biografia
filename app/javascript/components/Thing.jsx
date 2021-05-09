import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const OneLine = (props) => {
  const { object: thing } = props;

  const parts = [];

  if (thing.name != null) {
    parts.push(thing.name);
  } else {
    if (thing.make != null) {
      parts.push(thing.make);
    }
    if (thing.model != null) {
      parts.push(thing.model);
    }
  }

  if (parts.length === 0) {
    parts.push('Okänd sak');
  }

  return parts.join(', ');
};

const Thing = (props) => {
  const { object: thing } = props;
  const { currentUser } = props;
  const { mode } = props;

  if (mode === 'oneLine') {
    return (
      <OneLine object={thing} />
    );
  }

  let element = null;
  if (mode === 'full') {
    element = [];
    if (thing.name != null) {
      element.push(thing.name);
      element.push(<br />);
    }
    const makeModel = [];
    if (thing.make != null) {
      makeModel.push(thing.make);
    }
    if (thing.model != null) {
      makeModel.push(thing.model);
    }
    if (makeModel.length > 0) {
      element.push(makeModel.join(' '));
      element.push(<br />);
    }
    if (thing.kind != null) {
      element.push(thing.kind);
      element.push(<br />);
    }
    if (thing.serial != null) {
      element.push(`Serienummer: ${thing.serial}`);
      element.push(<br />);
    }
    if (element.length === 0) {
      element.push('Okänd sak');
    }
  } else {
    element = (
      <Link to={`/r/things/${thing.id}`}>
        <OneLine object={thing} />
      </Link>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              {element}
            </td>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={thing} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Thing.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    model: PropTypes.string,
    make: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  mode: PropTypes.string,
};

Thing.defaultProps = {
  mode: '',
};

export default Thing;
