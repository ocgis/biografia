import React from 'react';
import { Alert } from 'antd';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { ShowReferences } from './Reference';
import { apiUrl, oneName } from './Mappings';

class Show extends LoadData {
  constructor(props, showObject, _type_) {
    super(props);
    this._type_ = _type_;
    this.showObject = showObject;
    this.objectName = oneName(this._type_);
  }

  url = () => {
    const { match: { params: { id } } } = this.props;
    const { _type_ } = this;
    return apiUrl(_type_, id);
  }

  render = () => {
    const { _type_, state } = this;
    const { currentUser, error, showMode } = state;
    const object = state[oneName(_type_)];
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
                  reload={() => {
                    this.loadData();
                  }}
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
