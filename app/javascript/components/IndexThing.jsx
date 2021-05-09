import Index from './Index';
import Thing from './Thing';

class IndexThing extends Index {
  constructor(props) {
    super(props);
    this.showObject = Thing;
    this.objectName = 'things';
    this.objectsUrl = '/r/things';
    this.apiUrl = '/api/v1/things';
  }
}

export default IndexThing;
