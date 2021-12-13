import axios from 'axios';
import { apiUrl, oneName } from './Mappings';

const sendRequest = (requestFunction, url, data, handleResponse, handleError) => {
  const csrfToken = document.querySelector('[name=csrf-token]').content;
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

  requestFunction(url, data).then(handleResponse).catch(handleError);
};

const errorText = (error) => {
  if (error.response) {
    return `${error.response.status} ${error.response.statusText}`;
  }
  console.log(error);
  return 'An exception was raised. Check the console.';
};

const loadData = (url, objectName, onLoaded, loadMany, state) => {
  let newState = state;
  let loadUrl = url;
  if (loadMany) {
    if (newState == null) {
      newState = { offset: 0, limit: 200 };
    }
    const { offset, limit } = newState;
    loadUrl = `${url}?offset=${offset}&limit=${limit}`;
  }

  const handleResponse = (response) => {
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
  };

  const handleError = (error) => {
    const data = { error: errorText(error) };
    data[objectName] = null;
    onLoaded(data);
  };

  sendRequest(axios.get, loadUrl, null, handleResponse, handleError);
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

  const sendData = {};

  sendData[oneName(_type_)] = railsify(data[oneName(_type_)]);
  sendData.referFrom = data.referFrom;

  let url = apiUrl(_type_);
  let axiosCall = axios.post;

  if (sendData[oneName(_type_)].id != null) {
    url = apiUrl(_type_, sendData[oneName(_type_)].id);
    axiosCall = axios.patch;
  }

  const handleResponse = (response) => {
    const result = {};
    result[oneName(_type_)] = response.data[oneName(_type_)];
    handleResult(result);
  };

  const handleError = (error) => {
    handleResult({ error: errorText(error) });
  };

  sendRequest(axiosCall, url, sendData, handleResponse, handleError);
};

const removeData = (_type_, data, handleResult) => {
  const url = apiUrl(_type_, data[oneName(_type_)].id);

  const handleResponse = (response) => {
    const result = {};
    result[oneName(_type_)] = response.data[oneName(_type_)];
    handleResult(result);
  };

  const handleError = (error) => {
    handleResult({ error: errorText(error) });
  };

  sendRequest(axios.delete, url, null, handleResponse, handleError);
};

export { loadData, saveData, removeData };
