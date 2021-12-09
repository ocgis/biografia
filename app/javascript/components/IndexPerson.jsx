import React from 'react';
import Index from './Index';
import Person from './Person';

const IndexPerson = () => (
  <Index
    showObject={Person}
    _type_="Person"
  />
);

export default IndexPerson;
