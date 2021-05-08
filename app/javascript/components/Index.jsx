import React from 'react';
import { Link } from 'react-router-dom';
import LoadData from './LoadData';
import TopMenu from './TopMenu';

class Index extends LoadData {
  url = () => this.apiUrl;

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
    const { objectsUrl, showObject: ShowObject } = this;
    return (
      <React.Fragment key={object.id}>
        <Link to={`${objectsUrl}/${object.id}`}>
          <ShowObject object={object} />
        </Link>
        <br />
      </React.Fragment>
    );
  }
}

export default Index;
