import Index from './Index';
import Transfer from './Transfer';

class IndexTransfer extends Index {
  constructor(props) {
    super(props, Transfer, 'Transfer');
  }
}

export default IndexTransfer;
