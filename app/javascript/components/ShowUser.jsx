import React from 'react';
import Show from './Show';
import User from './User';
import TopMenu from './TopMenu';

class ShowUser extends Show {
  constructor(props) {
    super(props, User, 'User');
  }

  render = () => {
    const { objectName, state } = this;
    const { currentUser } = state;
    const object = state[objectName];
    const ShowObject = this.showObject;

    if (object == null) {
      return (
        <TopMenu />
      );
    }
    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <table>
          <tbody>
            <tr>
              <td>
                <ShowObject object={object} currentUser={currentUser} mode="full" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ShowUser;
