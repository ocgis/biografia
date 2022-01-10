import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { FixedSizeList as List } from 'react-window';
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
      divRef: createRef(),
      elementHeight: null,
      listHeight: null,
    };
    this.state[objectName] = null;
  }

  componentDidMount() {
    this.reload();
    window.addEventListener('resize', this.updateHeights);
  }

  componentDidUpdate() {
    this.updateHeights();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeights);
  }

  updateHeights = () => {
    const { divRef } = this.state;
    const { top, height } = divRef.current.getBoundingClientRect();
    const { listHeight: oldListHeight } = this.state;
    const heights = {};

    const listHeight = window.innerHeight - top;
    if (listHeight !== oldListHeight) {
      heights.listHeight = listHeight;
    }

    if (oldListHeight == null) {
      heights.elementHeight = height;
    }

    if (Object.entries(heights).length > 0) {
      this.setState(heights);
    }
  };

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
    const { elementHeight, listHeight, divRef } = this.state;

    if (objects == null || objects.length === 0) {
      return null;
    }

    const Row = ({ index, style }) => (
      <div style={style}>
        {this.renderObject(objects[index])}
      </div>
    );

    return (
      <div ref={divRef}>
        { listHeight != null
          ? (
            <List
              height={listHeight}
              itemCount={objects.length}
              itemSize={elementHeight}
            >
              {Row}
            </List>
          )
          : this.renderObject(objects[0])}
      </div>
    );
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
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  _type_: PropTypes.string.isRequired,
  showObject: PropTypes.func.isRequired,
};

export default Index;
