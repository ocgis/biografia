import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import {
  showObject, webUrl,
} from './Mappings';

class ListObjects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      divRef: createRef(),
      elementHeight: null,
      listHeight: null,
    };
  }

  componentDidMount() {
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
    if (divRef != null && divRef.current != null) {
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
    }
  };

  renderObject = (object) => {
    const { currentUser, _type_ } = this.props;
    const ShowObject = showObject(_type_);
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
  };

  render() {
    const { objects } = this.props;
    const { elementHeight, listHeight, divRef } = this.state;

    if (objects == null || objects.length === 0) {
      return null;
    }

    const renderRow = ({ index, style }) => (
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
  objects: PropTypes.arrayOf(PropTypes.shape()),
};
ListObjects.defaultProps = {
  currentUser: { name: '' },
  objects: [],
};

export default ListObjects;
