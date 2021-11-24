import Index from './Index';
import Person from './Person';

class IndexPerson extends Index {
  constructor(props) {
    super(props, Person, 'Person');
  }
}

export default IndexPerson;
