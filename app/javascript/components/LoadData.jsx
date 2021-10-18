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

    axios.get(this.url())
      .then((response) => {
        const newState = {
          currentUser: response.data.current_user,
        };
        newState[objectName] = response.data[objectName];
        this.setState(newState);
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ error: `${error.response.status} ${error.response.statusText}` });
        } else {
          const { history } = this.props;
          console.log(error);
          console.log('Push /');
          history.push('/');
        }
      });
  }

  saveData(handleResult) {
    const railsify = (indata) => {
      const {
        created_at,
        updated_at,
        version,
        related,
        ...outdata
      } = indata;
      Object.entries(outdata).forEach((entry) => {
        const [key, value] = entry;
        if (Array.isArray(value)) {
          const newKey = `${key}_attributes`;
          outdata[newKey] = outdata[key].map((e) => railsify(e));
          delete outdata[key];
        }
      });
      return outdata;
    };

    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { objectName, state } = this;

    const sendData = railsify(state[objectName]);

    axios.patch(this.url(), sendData)
      .then((response) => {
        const result = {};
        result[objectName] = response.data[objectName];
        handleResult(result);
      })
      .catch((error) => {
        if (error.response) {
          handleResult({ error: `${error.response.status} ${error.response.statusText}` });
        } else {
          const { history } = this.props;
          console.log(error);
          console.log('Push /');
          history.push('/');
        }
      });
  }
}
LoadData.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default LoadData;
