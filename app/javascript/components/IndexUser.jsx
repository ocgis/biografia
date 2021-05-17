import Index from './Index';
import User from './User';

class IndexUser extends Index {
  constructor(props) {
    super(props);
    this.showObject = User;
    this.objectName = 'users';
    this.objectsUrl = '/r/users';
    this.apiUrl = '/api/v1/users';
  }
}

export default IndexUser;
