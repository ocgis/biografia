import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

class Remove extends React.Component {
  removeData(handleResult) {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { objectName, state } = this;

    const url = `${this.apiUrl}/${state[objectName].id}`;

    axios.delete(url).then((response) => {
      const result = {};
      result[objectName] = response.data[objectName];
      handleResult(result);
    }).catch((error) => {
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
Remove.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default Remove;
