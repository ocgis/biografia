import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { TopMenu } from './TopMenu';
import { ShowReferences } from './Reference';

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      this.loadData();
    }
  }

  resetState() {
    const { objectName } = this;
    this.state = {
      currentUser: null,
      error: null,
    };
    this.state[objectName] = null;
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { match: { params: { id } } } = this.props;
    const { apiUrl, objectName } = this;

    axios.get(`${apiUrl}/${id}`)
      .then((response) => {
        const newState = {
          currentUser: response.data.current_user,
        };
        newState[objectName] = response.data[objectName];
        this.setState(newState);
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ error: `${error.response.status} ${error.response.statusText}` });
        } else {
          const { history } = this.props;
          console.log(error);
          console.log('Push /');
          history.push('/');
        }
      });
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
