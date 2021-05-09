import Index from './Index';
import Event from './Event';

class IndexEvent extends Index {
  constructor(props) {
    super(props);
    this.showObject = Event.OneLine;
    this.objectName = 'events';
    this.objectsUrl = '/r/events';
    this.apiUrl = '/api/v1/events';
  }
}

export default IndexEvent;
