/* eslint-disable import/prefer-default-export */

const mappings = {
  Address: {
    oneName: 'address',
    manyName: 'addresses',
  },
  Event: {
    oneName: 'event',
    manyName: 'events',
  },
  EventDate: {
    oneName: 'event_date',
    manyName: 'event_dates',
  },
  Export: {
    oneName: 'export',
    manyName: 'exports',
  },
  Import: {
    oneName: 'import',
    manyName: 'imports',
  },
  Medium: {
    oneName: 'medium',
    manyName: 'media',
  },
  Note: {
    oneName: 'note',
    manyName: 'notes',
  },
  Person: {
    oneName: 'person',
    manyName: 'people',
  },
  Reference: {
    oneName: 'reference',
    manyName: 'references',
  },
  Relationship: {
    oneName: 'relationship',
    manyName: 'relationships',
  },
  Thing: {
    oneName: 'thing',
    manyName: 'things',
  },
  Transfer: {
    oneName: 'transfer',
    manyName: 'transfers',
  },
  User: {
    oneName: 'user',
    manyName: 'users',
  },
};

const oneName = (_type_) => mappings[_type_].oneName;

const manyName = (_type_) => mappings[_type_].manyName;

const url = (baseUrl, _type_, id, action) => {
  if (id == null) {
    return `${baseUrl}/${mappings[_type_].manyName}`;
  }
  if (action == null) {
    return `${baseUrl}/${mappings[_type_].manyName}/${id}`;
  }
  return `${baseUrl}/${mappings[_type_].manyName}/${id}/${action}`;
};

const apiUrl = (_type_, id, action) => url('/api/v1', _type_, id, action);

const webUrl = (_type_, id, action) => url('/r', _type_, id, action);

export {
  oneName, manyName, apiUrl, webUrl,
};
