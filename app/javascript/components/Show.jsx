import React from 'react';
import { Alert } from 'antd';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { ShowReferences } from './Reference';

class Show extends LoadData {
  url = () => {
    const { match: { params: { id } } } = this.props;
    const { apiUrl } = this;
    return `${apiUrl}/${id}`;
  }

  render = () => {
    const { objectName, state } = this;
    const { currentUser, error, showMode } = state;
    const object = state[objectName];
    const ShowObject = this.showObject;
    let alertElement = null;

    if (error != null) {
      alertElement = <Alert message={error} type="error" showIcon />;
    }

    if (object == null) {
      return (
        <TopMenu />
      );
    }
    return (
      <div>
        <TopMenu currentUser={currentUser} />
        { alertElement }
        <table>
          <tbody>
            <tr>
              <td>
                <ShowObject
                  object={object}
                  currentUser={currentUser}
                  mode={showMode}
                  reload={() => {
                    this.loadData();
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <ShowReferences
                  related={object.related}
                  currentUser={currentUser}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Show;
