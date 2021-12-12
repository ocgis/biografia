import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { loadData } from './Requests';
import TopMenu from './TopMenu';
import { apiUrl, manyName, webUrl } from './Mappings';

class Index extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = manyName(_type_);
    this.state = {
      currentUser: null,
    };
    this.state[objectName] = null;
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    const { _type_ } = this.props;

    const onLoaded = (data) => {
      const { state } = this;
      const objectName = manyName(_type_);
      if (state[objectName] == null) {
        this.setState(data);
      } else {
        state[objectName] = state[objectName].concat(data[objectName]);
        this.setState(state);
      }
    };

    loadData(apiUrl(_type_), manyName(_type_), onLoaded, true);
  };

  render = () => {
    const { _type_ } = this.props;
    const { state } = this;
    const { currentUser, error } = state;
    const objects = state[manyName(_type_)];

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        { error != null
          && (
            <Alert message={error} type="error" showIcon />
          )}
        { objects != null
          && this.renderObjects(objects) }
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
