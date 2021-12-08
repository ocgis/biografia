import React from 'react';
import { Link } from 'react-router-dom';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { apiUrl, manyName, webUrl } from './Mappings';

class Index extends React.Component {
  constructor(props, showObject, _type_) {
    super(props);
    this._type_ = _type_;
    this.showObject = showObject;
    this.objectName = manyName(this._type_);

    this.state = {
      currentUser: null,
    };
    this.state[this.objectName] = null;
  }

  url = () => apiUrl(this._type_);

  render = () => {
    const { objectName, state } = this;
    const { currentUser } = state;
    const objects = state[objectName];

    const onLoaded = (data) => {
      this.setState(data);
    };

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <LoadData
          url={this.url()}
          objectName={this.objectName}
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
    const { _type_, showObject: ShowObject } = this;
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

export default Index;
