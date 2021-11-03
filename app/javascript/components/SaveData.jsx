import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

class SaveData extends React.Component {
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

    const sendData = {};
    sendData[objectName] = railsify(state[objectName]);

    let url = this.apiUrl;
    let axiosCall = axios.post;

    if (sendData.id != null) {
      url = `${this.apiUrl}/${sendData.id}`;
      axiosCall = axios.patch;
    }

    axiosCall(url, sendData).then((response) => {
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
SaveData.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default SaveData;
