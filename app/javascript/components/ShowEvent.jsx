import Show from './Show';
import Event from './Event';

class ShowEvent extends Show {
  constructor(props) {
    super(props, Event, 'Event');
  }
}

export default ShowEvent;
