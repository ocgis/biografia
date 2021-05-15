import Index from './Index';
import Export from './Export';

class IndexExport extends Index {
  constructor(props) {
    super(props);
    this.showObject = Export;
    this.objectName = 'exports';
    this.objectsUrl = '/r/exports';
    this.apiUrl = '/api/v1/exports';
  }
}

export default IndexExport;
