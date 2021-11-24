import Index from './Index';
import User from './User';

class IndexUser extends Index {
  constructor(props) {
    super(props, User, 'User');
  }
}

export default IndexUser;
