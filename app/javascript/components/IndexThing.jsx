import Index from './Index';
import Thing from './Thing';

class IndexThing extends Index {
  constructor(props) {
    super(props, Thing, 'Thing');
  }
}

export default IndexThing;
