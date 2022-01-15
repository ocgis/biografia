/* eslint-disable import/prefer-default-export */

const mappings = {
  Import: {
    oneName: 'import',
    manyName: 'imports',
  },
};

const setMapping = (name, key, value) => {
  if (!(name in mappings)) {
    mappings[name] = {};
  }
  mappings[name][key] = value;
};

const getMapping = (name, key) => {
  if (name in mappings) {
    if (key in mappings[name]) {
      return mappings[name][key];
    }
  }
  console.log(`ERROR: mapping was not set for type ${name} with key ${key}`);
  return null;
};

const oneName = (_type_) => getMapping(_type_, 'oneName');

const manyName = (_type_) => getMapping(_type_, 'manyName');

const url = (baseUrl, _type_, id, action) => {
  if (id == null) {
    return `${baseUrl}/${manyName(_type_)}`;
  }
  if (action == null) {
    return `${baseUrl}/${manyName(_type_)}/${id}`;
  }
  return `${baseUrl}/${manyName(_type_)}/${id}/${action}`;
};

const apiUrl = (_type_, id, action) => url('/api/v1', _type_, id, action);

const webUrl = (_type_, id, action) => url('/r', _type_, id, action);

export {
  setMapping, getMapping, oneName, manyName, apiUrl, webUrl,
};
