import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modifier, VersionInfo } from './Common';

const OneLine = (props) => {
  const { object: relationship } = props;
  const { object: { related: { people } } } = props;

  const parts = [];

  if (relationship.name == null || relationship.name === '') {
    parts.push('Familj');
  } else {
    parts.push(relationship.name);
  }

  if (people.length === 1) {
    parts.push(` bestående av ${people[0].name}`);
  } else if (people.length === 2) {
    parts.push(` bestående av ${people[0].name} och ${people[1].name}`);
  } else if (people.length === 3) {
    parts.push(` bestående av ${people[0].name}, ${people[1].name} och en person till`);
  } else if (people.length > 3) {
    const extraPeople = people.length - 2;
    parts.push(` bestående av ${people[0].name}, ${people[1].name} och ${extraPeople} personer till`);
  }

  return parts;
};

const Relationship = (props) => {
  const { object: relationship } = props;
  const { currentUser } = props;
  const { showFull } = props;

  if (showFull) {
    return 'Implement relationship show full';
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <Link to={`/r/relationships/${relationship.id}`}>
                <OneLine object={relationship} />
              </Link>
            </td>
            <Modifier currentUser={currentUser} />
            <td>
              <VersionInfo object={relationship} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Relationship.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    related: PropTypes.shape({}),
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Relationship.defaultProps = {
  showFull: false,
};

export { Relationship as default, Relationship };
