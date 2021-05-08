import Show from './Show';
import { Address } from './Address';

class ShowAddress extends Show {
  constructor(props) {
    super(props);
    this.showObject = Address;
    this.objectName = 'address';
    this.apiUrl = '/api/v1/addresses';
  }
}

export default ShowAddress;
