import React from 'react';
import { Link } from 'react-router-dom';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { apiUrl, controller, webUrl } from './Mappings';

class Index extends LoadData {
  constructor(props, showObject, _type_) {
    super(props);
    this._type_ = _type_;
    this.showObject = showObject;
    this.objectName = controller(this._type_);
  }

  url = () => apiUrl(this._type_);

  render = () => {
    const { objectName, state } = this;
    const { currentUser } = state;
    const objects = state[objectName];

    if (objects == null) {
      return (
        <TopMenu />
      );
    }
    return (
      <div>
        <TopMenu currentUser={currentUser} />
        {this.renderObjects(objects)}
      </div>
    );
  }

  renderObjects = (objects) => objects.map((object) => this.renderObject(object));

  renderObject = (object) => {
    const { _type_, showObject: ShowObject } = this;
    const { currentUser } = this.state;
    return (
      <React.Fragment key={object.id}>
        <Link to={webUrl(_type_, object.id)}>
          <ShowObject object={object} mode="oneLine" currentUser={currentUser} />
        </Link>
        <br />
      </React.Fragment>
    );
  }
}

export default Index;
