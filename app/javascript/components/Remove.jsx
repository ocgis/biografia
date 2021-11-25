import axios from 'axios';
import React from 'react';
import { apiUrl, oneName } from './Mappings';

class Remove extends React.Component {
  constructor(props, _type_) {
    super(props);
    this._type_ = _type_;
  }

  removeData(handleResult) {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { _type_, state } = this;

    const url = apiUrl(_type_, state[oneName(_type_)].id);

    axios.delete(url).then((response) => {
      const result = {};
      result[oneName(_type_)] = response.data[oneName(_type_)];
      handleResult(result);
    }).catch((error) => {
      if (error.response) {
        handleResult({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        this.setState({ error: 'An exception was raised. Check the console.' });
      }
    });
  }
}

export default Remove;
