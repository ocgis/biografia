import Show from './Show';
import { Person } from './Person';

class ShowPerson extends Show {
  constructor(props) {
    super(props);
    this.showObject = Person;
    this.objectName = 'person';
    this.apiUrl = '/api/v1/people';
  }
}

export default ShowPerson;
