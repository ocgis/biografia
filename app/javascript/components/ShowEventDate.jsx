import Show from './Show';
import EventDate from './EventDate';

class ShowEventDate extends Show {
  constructor(props) {
    super(props);
    this.showObject = EventDate;
    this.objectName = 'event_date';
    this.apiUrl = '/api/v1/event_dates';
  }
}

export default ShowEventDate;
