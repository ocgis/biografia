import React from 'react';
import PropTypes from 'prop-types';
import LoadData from './LoadData';
import { TopMenu } from './TopMenu';
import { ShowReferences } from './Reference';

class Show extends LoadData {
  url = () => {
    const { match: { params: { id } } } = this.props;
    const { apiUrl } = this;
    return `${apiUrl}/${id}`;
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
                <ShowObject object={object} currentUser={currentUser} showFull />
              </td>
            </tr>
            <tr>
              <td>
                <ShowReferences related={object.related} currentUser={currentUser} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
Show.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default Show;
