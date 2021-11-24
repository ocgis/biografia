import Show from './Show';
import Note from './Note';

class ShowNote extends Show {
  constructor(props) {
    super(props, Note, 'Note');
  }
}

export default ShowNote;
