import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { apiUrl, manyName, webUrl } from './Mappings';

class Index extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = manyName(_type_);
    this.state = {
      currentUser: null,
      objectName,
    };
    this.state[objectName] = null;
  }

  render = () => {
    const { _type_ } = this.props;
    const { state } = this;
    const { currentUser, objectName } = state;
    const objects = state[objectName];

    const onLoaded = (data) => {
      this.setState(data);
    };

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <LoadData
          url={apiUrl(_type_)}
          objectName={objectName}
          onLoaded={onLoaded}
          loadMany
        >
          {this.renderObjects(objects)}
        </LoadData>
      </div>
    );
  }

  renderObjects = (objects) => {
    if (objects == null) {
      return null;
    }
    return objects.map((object) => this.renderObject(object));
  }

  renderObject = (object) => {
    const { _type_, showObject: ShowObject } = this.props;
    const { currentUser } = this.state;
    return (
      <React.Fragment key={object.id}>
        <Link to={webUrl(_type_, object.id)}>
          <ShowObject
            object={object}
            mode="oneLine"
            currentUser={currentUser}
            reload={() => alert('Unexpected: Implement reload() for Index()')}
          />
        </Link>
        <br />
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  _type_: PropTypes.string.isRequired,
  showObject: PropTypes.func.isRequired,
};

export default Index;
