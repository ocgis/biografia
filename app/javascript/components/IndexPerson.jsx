import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopMenu } from './TopMenu';
import Person from './Person';

class IndexPerson extends React.Component {
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
      people: null,
      error: null,
    };
  }

  loadData() {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    axios.get('/api/v1/people')
      .then((response) => {
        this.setState({ people: response.data.people });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ error: `${error.response.status} ${error.response.statusText}` });
        } else {
          console.log('Push /');
          const { history } = this.props;
          history.push('/');
        }
      });
  }

  render = () => {
    const { people } = this.state;
    if (people == null) {
      return (
        <TopMenu />
      );
    }
    return (
      <div>
        <TopMenu />
        {this.renderPeople()}
      </div>
    );
  }

  renderPeople = () => {
    const { people } = this.state;
    return people.map((person) => this.renderPerson(person));
  }

  renderPerson = (person) => (
    <React.Fragment key={person.id}>
      <Link to={`/r/people/${person.id}`}>
        <Person.OneLine object={person} />
      </Link>
      <br />
    </React.Fragment>
  );
}
IndexPerson.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default IndexPerson;
