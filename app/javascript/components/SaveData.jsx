import axios from 'axios';
import React from 'react';
import { apiUrl, oneName } from './Mappings';

class SaveData extends React.Component {
  constructor(props, _type_) {
    super(props);
    this._type_ = _type_;
  }

  saveData(handleResult) {
    const railsify = (indata) => {
      const {
        created_at,
        updated_at,
        version,
        related,
        type_,
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

    const { _type_, state } = this;

    const sendData = {};
    sendData[oneName(_type_)] = railsify(state[oneName(_type_)]);
    sendData.referFrom = state.referFrom;

    let url = apiUrl(_type_);
    let axiosCall = axios.post;

    if (sendData[oneName(_type_)].id != null) {
      url = apiUrl(_type_, sendData[oneName(_type_)].id);
      axiosCall = axios.patch;
    }

    axiosCall(url, sendData).then((response) => {
      const result = {};
      result[oneName(_type_)] = response.data[oneName(_type_)];
      handleResult(result);
    }).catch((error) => {
      if (error.response) {
        handleResult({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        handleResult({ error: 'An exception was raised. Check the console.' });
      }
    });
  }
}

export default SaveData;
