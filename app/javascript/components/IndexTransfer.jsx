import Index from './Index';
import Transfer from './Transfer';

class IndexTransfer extends Index {
  constructor(props) {
    super(props);
    this.showObject = Transfer;
    this.objectName = 'transfers';
    this.objectsUrl = '/r/transfers';
    this.apiUrl = '/api/v1/transfers';
  }
}

export default IndexTransfer;
