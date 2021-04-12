import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { TopMenu } from './TopMenu';
import { ShowReferences } from './Reference';
import { Person } from './Person';

class ShowPerson extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search } } = this.props;
    if (search !== prevProps.location.search) {
      this.loadData();
    }
  }

  resetState() {
    this.state = {
      currentUser: null,
      person: null,
      error: null,
    };
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const { match: { params: { id } } } = this.props;

    axios.get(`/api/v1/people/${id}`)
      .then((response) => {
        this.setState({
          currentUser: response.data.current_user,
          person: response.data.person,
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
    const { person, currentUser } = this.state;
    if (person == null) {
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
                <Person person={person} currentUser={currentUser} showFull />
              </td>
              <td>
                <ShowReferences related={person.related} currentUser={currentUser} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
ShowPerson.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export { ShowPerson };
