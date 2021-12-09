import React from 'react';
import Index from './Index';
import Thing from './Thing';

const IndexThing = () => (
  <Index
    showObject={Thing}
    _type_="Thing"
  />
);

export default IndexThing;
