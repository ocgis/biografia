import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

class LoadData extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    this.loadData();
  }

  resetState() {
    const { props: { objectName } } = this;
    this.state = {
      offset: 0,
      limit: 200,
      currentUser: null,
      showMode: 'full',
      error: null,
    };
    this.state[objectName] = null;
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const {
      props: {
        url, objectName, onLoaded, loadMany,
      },
      state,
    } = this;

    let loadUrl = url;
    if (loadMany) {
      const { offset, limit } = state;
      loadUrl = `${url}?offset=${offset}&limit=${limit}`;
    }

    axios.get(loadUrl).then((response) => {
      const newState = {
        currentUser: response.data.current_user,
      };
      if (state[objectName] == null) {
        newState[objectName] = response.data[objectName];
      } else {
        newState[objectName] = state[objectName].concat(response.data[objectName]);
      }
      onLoaded(newState);
      this.setState(newState);

      if (loadMany) {
        const { offset, limit } = state;
        if (response.data[objectName].length === limit
            && offset < 1000000) {
          this.state.offset = limit + offset;
          this.state.limit = limit * 100;
          this.loadData();
        }
      }
    }).catch((error) => {
      if (error.response) {
        this.setState({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        this.setState({ error: 'An exception was raised. Check the console.' });
      }
    });
  }

  render = () => {
    const { props: { children, objectName }, state } = this;

    if (state.error != null) {
      return (
        <Alert message={state.error} type="error" showIcon />
      );
    }

    if (state[objectName] == null) {
      return null;
    }

    return children;
  }
}
LoadData.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string.isRequired,
  objectName: PropTypes.string.isRequired,
  onLoaded: PropTypes.func.isRequired,
  loadMany: PropTypes.bool,
};
LoadData.defaultProps = {
  children: null,
  loadMany: false,
};

export default LoadData;
