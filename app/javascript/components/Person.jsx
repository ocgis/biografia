import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopMenu } from './TopMenu';
import { Modifier, VersionInfo } from './Common';

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
        {person.long_name}
      </Link>
      <br />
    </React.Fragment>
  );
}
IndexPerson.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const PersonNames = (props) => {
  const { object: { person_names: pns } } = props;

  const renderPersonName = (personName, index) => {
    if (personName.calling_name != null) {
      let parts = personName.given_name.split(personName.calling_name);
      for (let i = parts.length - 1; i > 0; i -= 1) {
        parts.splice(i, 0, <strong key={index}>{personName.calling_name}</strong>);
      }
      parts = parts.concat(` ${personName.surname}`);

      return parts;
    }
    return `${personName.given_name} ${personName.surname}`;
  };

  const personNames = pns.map((personName, i) => renderPersonName(personName, i));

  if (personNames.length === 1) {
    return personNames[0];
  }
  if (personNames.length > 1) {
    let result = [].concat(personNames[personNames.length - 1]);
    result.push(' (');
    result = result.concat(personNames[0]);
    for (let i = 1; i < personNames.length - 1; i += 1) {
      result.push(', ');
      result = result.concat(personNames[i]);
    }
    result.push(')');
    return result;
  }
  return '!!!Error in DB: person name missing!!!';
};

const Person = (props) => {
  const { object: person, currentUser, showFull } = props;

  let name = null;
  if (showFull) {
    name = (
      <PersonNames object={person} />
    );
  } else {
    name = (
      <Link to={`/r/people/${person.id}`}>
        <PersonNames object={person} />
      </Link>
    );
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>
            {name}
            {' '}
            {person.sex}
          </td>
          <Modifier currentUser={currentUser} />
          <td>
            <VersionInfo object={person} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Person.propTypes = {
  object: PropTypes.shape({
    id: PropTypes.number,
    person_names: PropTypes.arrayOf(PropTypes.shape({})),
    sex: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  showFull: PropTypes.bool,
};

Person.defaultProps = {
  showFull: false,
};

Person.OneLine = PersonNames;

export { Person as default, IndexPerson };
