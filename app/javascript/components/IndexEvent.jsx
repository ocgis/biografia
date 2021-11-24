import Index from './Index';
import Event from './Event';

class IndexEvent extends Index {
  constructor(props) {
    super(props, Event, 'Event');
  }
}

export default IndexEvent;
