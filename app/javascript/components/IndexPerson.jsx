import Index from './Index';
import Person from './Person';

class IndexPerson extends Index {
  constructor(props) {
    super(props);
    this.showObject = Person.OneLine;
    this.objectName = 'people';
    this.objectsUrl = '/r/people';
    this.apiUrl = '/api/v1/people';
  }
}

export default IndexPerson;
