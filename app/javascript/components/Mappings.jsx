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

  if (key === 'manyName') {
    // Setup a reverse mapping
    mappings[value] = { _type_: name };
  }
};

const getMapping = (name, key) => {
  if (name in mappings) {
    if (key in mappings[name]) {
      return mappings[name][key];
    }
    // Try reverse mapping
    if ('_type_' in mappings[name]) {
      return getMapping(mappings[name]._type_, key);
    }
  }
  throw Error(`ERROR: mapping was not set for type ${name} with key ${key}`);
};

const showObject = (_type_) => getMapping(_type_, 'showObject');
const editObject = (_type_) => getMapping(_type_, 'editObject');
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
  setMapping, getMapping, showObject, editObject, oneName, manyName, apiUrl, webUrl,
};
