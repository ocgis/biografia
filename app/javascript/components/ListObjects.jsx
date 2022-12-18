import React from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import {
  showObject,
} from './Mappings';

class ListObjects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elementTop: null,
      elementHeight: null,
      listHeight: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHeights);
  }

  componentDidUpdate() {
    this.updateHeights();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHeights);
  }

  updateHeights = (element) => {
    const heights = {};

    let { elementTop, elementHeight } = this.state;
    if (element != null) {
      const { top, height } = element.getBoundingClientRect();

      if (top !== elementTop) {
        elementTop = top;
        heights.elementTop = top;
      }

      if (height !== elementHeight) {
        elementHeight = height;
        heights.elementHeight = height;
      }
    }

    if ((elementHeight !== null) && (elementTop !== null)) {
      const { listHeight: oldListHeight } = this.state;

      const listHeight = window.innerHeight - elementTop;
      if (listHeight !== oldListHeight) {
        heights.listHeight = listHeight;
      }
    }

    if (Object.entries(heights).length > 0) {
      this.setState(heights);
    }
  };

  resizeHeights = () => {
    this.updateHeights(null);
  };

  renderObject = (object) => {
    const {
      currentUser, mode, reload, _type_,
    } = this.props;
    const ShowObject = showObject(_type_);
    return (
      <ShowObject
        key={object.id}
        object={object}
        mode={mode}
        currentUser={currentUser}
        reload={reload}
      />
    );
  };

  render() {
    const { objects } = this.props;
    const { elementHeight, listHeight } = this.state;

    if (objects == null || objects.length === 0) {
      return null;
    }

    const renderRow = ({ index, style }) => (
      <div style={style}>
        {this.renderObject(objects[index])}
      </div>
    );

    return (
      <div ref={this.updateHeights}>
        { listHeight != null
          ? (
            <List
              height={listHeight}
              itemCount={objects.length}
              itemSize={elementHeight}
            >
              {renderRow}
            </List>
          )
          : this.renderObject(objects[0])}
      </div>
    );
  }
}

ListObjects.propTypes = {
  currentUser: PropTypes.shape(),
  _type_: PropTypes.string.isRequired,
  mode: PropTypes.string,
  objects: PropTypes.arrayOf(PropTypes.shape()),
  reload: PropTypes.func.isRequired,
};
ListObjects.defaultProps = {
  currentUser: { name: '' },
  mode: '',
  objects: [],
};

export default ListObjects;
