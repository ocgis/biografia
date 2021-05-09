import Index from './Index';
import Address from './Address';

class IndexAddress extends Index {
  constructor(props) {
    super(props);
    this.showObject = Address;
    this.objectName = 'addresses';
    this.objectsUrl = '/r/addresses';
    this.apiUrl = '/api/v1/addresses';
  }
}

export default IndexAddress;
