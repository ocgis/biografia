import Index from './Index';
import Address from './Address';

class IndexAddress extends Index {
  constructor(props) {
    super(props, Address, 'Address');
  }
}

export default IndexAddress;
