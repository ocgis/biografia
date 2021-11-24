import Show from './Show';
import Person from './Person';

class ShowPerson extends Show {
  constructor(props) {
    super(props, Person, 'Person');
  }
}

export default ShowPerson;
