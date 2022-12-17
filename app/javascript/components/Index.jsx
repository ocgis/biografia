import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Input } from 'antd';
import { loadData } from './Requests';
import TopMenu from './TopMenu';
import ListObjects from './ListObjects';
import {
  apiUrl, filterObject, manyName,
} from './Mappings';

const { Search } = Input;

class Index extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = manyName(_type_);
    this.state = {
      currentUser: null,
      filter: '',
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

  render() {
    const { _type_ } = this.props;
    const { state } = this;
    const {
      currentUser, error, filter,
    } = state;

    const updateFilter = (data) => {
      this.setState({ filter: data.target.value });
    };

    let objects = state[manyName(_type_)];

    if (objects != null && filter !== '') {
      objects = objects.filter((object) => filterObject(object, filter));
    }

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <Search placeholder="filtrera" onChange={updateFilter} />
        { error != null
          && (
            <Alert message={error} type="error" showIcon />
          )}
        <ListObjects
          _type_={_type_}
          objects={objects}
          currentUser={currentUser}
        />
      </div>
    );
  }
}

Index.propTypes = {
  _type_: PropTypes.string.isRequired,
};

export default Index;
