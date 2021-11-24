import Show from './Show';
import Address from './Address';

class ShowAddress extends Show {
  constructor(props) {
    super(props, Address, 'Address');
  }
}

export default ShowAddress;
