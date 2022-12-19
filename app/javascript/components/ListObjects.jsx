import React from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';
import {
  showObject,
} from './Mappings';

class ListObjects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listHeight: null,
    };

    this.itemSizes = [];
    this.updateItemsAfter = -1;
    this.listElement = null;
    this.divElement = null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHeights);
  }

  componentDidUpdate() {
    this.updateListHeight(this.divElement);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHeights);
  }

  updateListHeight = (element) => {
    if (element != null) {
      const { top, height } = element.getBoundingClientRect();

      const { listHeight: oldListHeight } = this.state;

      const listHeight = window.innerHeight - top;
      if (listHeight !== oldListHeight) {
        this.setState({ listHeight });
      }

      this.divElement = element;
    }
  };

  resizeHeights = () => {
    this.updateListHeight(this.divElement);
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
    const updateItemSizes = (listElement) => {
      if (listElement != null) {
        listElement.resetAfterIndex(this.updateItemsAfter);
        this.updateItemsAfter = -1;
        this.listElement = listElement;
      }
    };

    const setItemSize = (index, element) => {
      if (element != null) {
        const { top, height } = element.getBoundingClientRect();

        if (height !== this.itemSizes[index]) {
          this.itemSizes[index] = height;
          if ((this.updateItemsAfter === -1) || (this.updateItemsAfter > index)) {
            this.updateItemsAfter = index;

            if (this.listElement != null) {
              updateItemSizes(this.listElement);
            }
          }
        }
      }
    };

    const getItemSize = (index) => {
      if (this.itemSizes[index] == null) {
        return 150;
      }
      return this.itemSizes[index];
    };

    const { objects } = this.props;
    const { listHeight } = this.state;

    if (objects == null || objects.length === 0) {
      return null;
    }

    const renderRow = ({ index, style }) => (
      <div style={style}>
        <div ref={(element) => setItemSize(index, element)}>
          {this.renderObject(objects[index])}
        </div>
      </div>
    );

    return (
      <div ref={this.updateListHeight}>
        { listHeight != null
          ? (
            <List
              ref={updateItemSizes}
              height={listHeight}
              itemCount={objects.length}
              itemSize={getItemSize}
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
