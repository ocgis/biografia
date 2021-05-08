import Show from './Show';
import Note from './Note';

class ShowNote extends Show {
  constructor(props) {
    super(props);
    this.showObject = Note;
    this.objectName = 'note';
    this.apiUrl = '/api/v1/notes';
  }
}

export default ShowNote;
