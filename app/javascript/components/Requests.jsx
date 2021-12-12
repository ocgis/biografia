import axios from 'axios';
import { apiUrl, oneName } from './Mappings';

const loadData = (url, objectName, onLoaded, loadMany, state) => {
  const csrfToken = document.querySelector('[name=csrf-token]').content;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

  let newState = state;
  let loadUrl = url;
  if (loadMany) {
    if (newState == null) {
      newState = { offset: 0, limit: 200 };
    }
    const { offset, limit } = newState;
    loadUrl = `${url}?offset=${offset}&limit=${limit}`;
  }

  axios.get(loadUrl).then((response) => {
    const data = {
      currentUser: response.data.current_user,
      error: null,
    };
    data[objectName] = response.data[objectName];
    onLoaded(data);

    if (loadMany) {
      const { offset, limit } = newState;
      if (response.data[objectName].length === limit
          && offset < 1000000) {
        newState.offset = limit + offset;
        newState.limit = limit * 100;
        loadData(url, objectName, onLoaded, loadMany, newState);
      }
    }
  }).catch((error) => {
    const data = {};
    data[objectName] = null;
    if (error.response) {
      data.error = `${error.response.status} ${error.response.statusText}`;
    } else {
      console.log(error);
      data.error = 'An exception was raised. Check the console.';
    }
    onLoaded(data);
  });
};

const saveData = (_type_, data, handleResult) => {
  const railsify = (indata) => {
    const {
      created_at,
      updated_at,
      version,
      related,
      __type__,
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

  const sendData = {};

  sendData[oneName(_type_)] = railsify(data[oneName(_type_)]);
  sendData.referFrom = data.referFrom;

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
};

const removeData = (_type_, data, handleResult) => {
  const csrfToken = document.querySelector('[name=csrf-token]').content;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

  const url = apiUrl(_type_, data[oneName(_type_)].id);

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
};

export { loadData, saveData, removeData };
