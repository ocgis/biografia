import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
        console.log(response);
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
        {this.renderPerson()}
      </div>
    );
  }

  renderPerson = () => {
    console.log(this.state);
    const { person, currentUser } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>
              {this.renderName()}
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
  }

  renderName = () => {
    const { person: { person_names: pns } } = this.state;
    const personNames = pns.map((personName, i) => this.renderPersonName(personName, i));

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
  }

  renderPersonName = (personName, index) => {
    if (personName.calling_name != null) {
      let parts = personName.given_name.split(personName.calling_name);
      for (let i = parts.length - 1; i > 0; i -= 1) {
        parts.splice(i, 0, <strong key={index}>{personName.calling_name}</strong>);
      }
      parts = parts.concat(` ${personName.surname}`);

      return parts;
    }
    return `${personName.given_name} ${personName.surname}`;
  }
}
ShowPerson.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired }).isRequired,
};

class AddPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const handleResponse = (person) => {
      const { onFinish } = this.props;
      console.log(person);
      onFinish(person);
    };

    const handleError = (error) => {
      this.setState({ error: error.toString() });
    };

    const onFinish = (person) => {
      console.log(person);

      const csrfToken = document.querySelector('[name=csrf-token]').content;
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

      axios.post('/api/v1/people', { person })
        .then((response) => handleResponse(response))
        .catch((error) => handleError(error));
    };

    const { error } = this.state;

    return (
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="sex"
          >
            <Input placeholder="Kön" />
          </Form.Item>
          <Form.List
            name="person_names_attributes"
            initialValue={[{ given_name: 'Init' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({
                  key, name, fieldKey,
                }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      name={[name, '_delete']}
                      initialValue={false}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'given_name']}
                      fieldKey={[fieldKey, 'given_name']}
                    >
                      <Input placeholder="Förnamn" />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'calling_name']}
                      fieldKey={[fieldKey, 'calling_name']}
                    >
                      <Input placeholder="Tilltalsnamn" />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'surname']}
                      fieldKey={[fieldKey, 'surname']}
                    >
                      <Input placeholder="Efternamn" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Lägg till namn
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ok
            </Button>
          </Form.Item>
        </Form>
        { error }
      </div>
    );
  }
}
AddPerson.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export { IndexPerson, ShowPerson, AddPerson };
