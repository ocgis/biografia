import Show from './Show';
import Medium from './Medium';

class ShowMedium extends Show {
  constructor(props) {
    super(props);
    this.showObject = Medium;
    this.objectName = 'medium';
    this.apiUrl = '/api/v1/media';
  }
}

export default ShowMedium;
