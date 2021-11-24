import Show from './Show';
import Thing from './Thing';

class ShowThing extends Show {
  constructor(props) {
    super(props, Thing, 'Thing');
  }
}

export default ShowThing;
