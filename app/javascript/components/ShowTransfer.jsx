import React from 'react';
import Show from './Show';
import Transfer from './Transfer';
import TopMenu from './TopMenu';

class ShowTransfer extends Show {
  constructor(props) {
    super(props);
    this.showObject = Transfer;
    this.objectName = 'transfer';
    this.apiUrl = '/api/v1/transfers';
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

export default ShowTransfer;
