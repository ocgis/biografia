import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

class LoadData extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      this.loadData();
    }
  }

  resetState() {
    const { objectName } = this;
    this.state = {
      currentUser: null,
      showMode: 'full',
      error: null,
    };
    this.state[objectName] = null;
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { objectName } = this;

    axios.get(this.url()).then((response) => {
      const newState = {
        currentUser: response.data.current_user,
      };
      newState[objectName] = response.data[objectName];
      this.setState(newState);
    }).catch((error) => {
      if (error.response) {
        this.setState({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        this.setState({ error: 'An exception was raised. Check the console.' });
      }
    });
  }
}
LoadData.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default LoadData;
