import Show from './Show';
import Event from './Event';

class ShowEvent extends Show {
  constructor(props) {
    super(props);
    this.showObject = Event;
    this.objectName = 'event';
    this.apiUrl = '/api/v1/events';
  }
}

export default ShowEvent;
