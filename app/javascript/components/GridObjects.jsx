import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid as Grid } from 'react-window';
import { showObject } from './Mappings';

class GridObjects extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHeights);
    this.updateHeights();
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
      const { height: oldHeight, width: oldWidth } = this.state;
      const { top } = divRef.current.getBoundingClientRect();

      const height = window.innerHeight - top;
      const width = window.innerWidth;
      if ((width !== oldWidth) || (height !== oldHeight)) {
        this.setState({ height, width });
      }
    }
  };

  renderObject = (objects, index) => {
    const {
      parent, currentUser, mode, reload, _type_,
    } = this.props;
    const object = objects[index];
    const context = {
      collection: objects,
      collectionIndex: index,
    };
    const ShowObject = showObject(_type_);
    return (
      <ShowObject
        key={object.id}
        parent={parent}
        object={object}
        context={context}
        mode={mode}
        currentUser={currentUser}
        reload={reload}
      />
    );
  };

  resetState() {
    this.state = {
      currentUser: null,
      divRef: createRef(),
      error: null,
      height: null,
      width: null,
    };
  }

  render() {
    const { objects } = this.props;

    if (objects == null || objects.length === 0) {
      return null;
    }

    const { divRef, height, width } = this.state;

    const mediumWidth = 120;
    const mediumHeight = 120 + 10;
    const columnCount = Math.trunc(width / mediumWidth);
    const rowCount = Math.trunc((objects.length + columnCount - 1) / columnCount);

    const renderCell = ({ columnIndex, rowIndex, style }) => {
      const index = columnIndex + rowIndex * columnCount;
      return (
        <div
          style={style}
        >
          {
            index < objects.length
            && this.renderObject(objects, index)
          }
        </div>
      );
    };

    return (
      <div ref={divRef}>
        { height != null
          && (
            <Grid
              columnCount={columnCount}
              columnWidth={mediumWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={mediumHeight}
              width={window.innerWidth}
            >
              {renderCell}
            </Grid>
          )}
      </div>
    );
  }
}
GridObjects.propTypes = {
  currentUser: PropTypes.shape(),
  _type_: PropTypes.string.isRequired,
  mode: PropTypes.string,
  parent: PropTypes.shape(),
  objects: PropTypes.arrayOf(PropTypes.shape()),
  reload: PropTypes.func.isRequired,
};
GridObjects.defaultProps = {
  currentUser: { name: '' },
  mode: '',
  parent: null,
  objects: [],
};

export default GridObjects;
