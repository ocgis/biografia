import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Base from './Base';
import Index from './Index';
import Show from './Show';
import Version from './Version';
import EditThing from './EditThing';
import { setMapping, webUrl } from './Mappings';

setMapping('Thing', 'oneName', 'thing');
setMapping('Thing', 'manyName', 'things');
setMapping('Thing', 'filterFields', ['name', 'kind', 'make', 'model', 'serial']);

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
  const {
    currentUser, mode, object: thing, reload,
  } = props;

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
      element.push(<br key="name" />);
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
      element.push(<br key="makeModel" />);
    }
    if (thing.kind != null) {
      element.push(thing.kind);
      element.push(<br key="kind" />);
    }
    if (thing.serial != null) {
      element.push(`Serienummer: ${thing.serial}`);
      element.push(<br key="serial" />);
    }
    if (element.length === 0) {
      element.push('Okänd sak');
    }
  } else {
    element = (
      <Link to={webUrl('Thing', thing.id)}>
        <OneLine object={thing} />
      </Link>
    );
  }

  return (
    <Base
      object={thing}
      editTitle="Ändra sak"
      modifierProps={{
        showAddEvent: true,
        showAddPerson: true,
        showMergeWith: true,
      }}
      currentUser={currentUser}
      reload={reload}
    >
      {element}
    </Base>
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
  reload: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

Thing.defaultProps = {
  mode: '',
};

setMapping('Thing', 'showObject', Thing);

setMapping('Thing', 'editObject', EditThing);

const IndexThing = () => (
  <Index
    _type_="Thing"
  />
);

const ShowThing = ({ match, location }) => (
  <Show
    _type_="Thing"
    match={match}
    location={location}
  />
);
ShowThing.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

const VersionThing = ({ match, location }) => (
  <Version
    _type_="Thing"
    match={match}
    location={location}
  />
);
VersionThing.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export { IndexThing, ShowThing, VersionThing };
