import Show from './Show';
import Thing from './Thing';

class ShowThing extends Show {
  constructor(props) {
    super(props);
    this.showObject = Thing;
    this.objectName = 'thing';
    this.apiUrl = '/api/v1/things';
  }
}

export default ShowThing;
