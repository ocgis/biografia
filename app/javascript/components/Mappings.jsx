/* eslint-disable import/prefer-default-export */

const mappings = {
  Address: {
    name: 'address',
    controller: 'addresses',
  },
  Event: {
    name: 'event',
    controller: 'events',
  },
  EventDate: {
    name: 'event_date',
    controller: 'event_dates',
  },
  Export: {
    name: 'export',
    controller: 'exports',
  },
  Medium: {
    name: 'medium',
    controller: 'media',
  },
  Note: {
    name: 'note',
    controller: 'notes',
  },
  Person: {
    name: 'person',
    controller: 'people',
  },
  Reference: {
    name: 'reference',
    controller: 'references',
  },
  Relationship: {
    name: 'relationship',
    controller: 'relationships',
  },
  Thing: {
    name: 'thing',
    controller: 'things',
  },
  Transfer: {
    name: 'transfer',
    controller: 'transfers',
  },
  User: {
    name: 'user',
    controller: 'users',
  },
};

const objectName = (_type_) => mappings[_type_].name;

const controller = (_type_) => mappings[_type_].controller;

const url = (baseUrl, _type_, id, action) => {
  if (id == null) {
    return `${baseUrl}/${mappings[_type_].controller}`;
  }
  if (action == null) {
    return `${baseUrl}/${mappings[_type_].controller}/${id}`;
  }
  return `${baseUrl}/${mappings[_type_].controller}/${id}/${action}`;
};

const apiUrl = (_type_, id, action) => url('/api/v1', _type_, id, action);

const webUrl = (_type_, id, action) => url('/r', _type_, id, action);

export {
  objectName, controller, apiUrl, webUrl,
};
