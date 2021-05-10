import Show from './Show';
import Relationship from './Relationship';

class ShowRelationship extends Show {
  constructor(props) {
    super(props);
    this.showObject = Relationship;
    this.objectName = 'relationship';
    this.apiUrl = '/api/v1/relationships';
  }
}

export default ShowRelationship;
