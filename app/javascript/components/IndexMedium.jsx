import Index from './Index';
import Medium from './Medium';

class IndexMedium extends Index {
  constructor(props) {
    super(props);
    this.showObject = Medium.OneLine;
    this.objectName = 'media';
    this.objectsUrl = '/r/media';
    this.apiUrl = '/api/v1/media';
  }
}

export default IndexMedium;
