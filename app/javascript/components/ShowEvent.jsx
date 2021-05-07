import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { TopMenu } from './TopMenu';
import { ShowReferences } from './Reference';
import { Event } from './Event';

class ShowEvent extends React.Component {
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
    this.state = {
      currentUser: null,
      event: null,
      error: null,
    };
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { match: { params: { id } } } = this.props;

    axios.get(`/api/v1/events/${id}`)
      .then((response) => {
        this.setState({
          currentUser: response.data.current_user,
          event: response.data.event,
        });
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
    const { event, currentUser } = this.state;
    if (event == null) {
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
                <Event object={event} currentUser={currentUser} showFull />
              </td>
            </tr>
            <tr>
              <td>
                <ShowReferences related={event.related} currentUser={currentUser} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
ShowEvent.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export { ShowEvent as default, ShowEvent };
