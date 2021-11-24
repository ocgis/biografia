import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TopMenu from './TopMenu';
import { apiUrl, webUrl } from './Mappings';

class SearchMedium extends React.Component {
  constructor(props) {
    super(props);
    this.resetState();
    this.apiUrl = apiUrl('Medium');
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

  render = () => {
    const { currentUser, error, nodes } = this.state;

    if (nodes == null) {
      return (
        <TopMenu />
      );
    }
    return (
      <div>
        <TopMenu currentUser={currentUser} />
        {this.renderNodes(nodes)}
        { error
          && (
            { error }
          )}
      </div>
    );
  }

  renderNodes =
    (nodes) => Object.entries(nodes).map(([path, number]) => this.renderNode(path, number));

  renderNode = (path, number) => {
    if (number == null) {
      return (
        <button
          key={path}
          type="button"
          onClick={() => this.registerImage(path)}
        >
          <img
            src={`/media/file_thumb?file=${path}`}
            alt={path}
          />
        </button>
      );
    }
    return (
      <React.Fragment key={path}>
        <Link to={{ search: `?path=${path}` }}>
          {`${path} (${number})`}
        </Link>
        <br />
      </React.Fragment>
    );
  }

  registerImage = (path) => {
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    const data = { file_name: path };
    axios.post(`${this.apiUrl}/register`, data).then((response) => {
      const { data: { medium } } = response;
      const { history } = this.props;

      if (medium != null) {
        history.push(webUrl('Medium', medium.id));
      } else {
        let { data: { error } } = response;
        if (error == null) {
          error = 'Missing medium in response';
        }
        this.setState({ error });
      }
    }).catch((error) => {
      if (error.response) {
        this.setState({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        this.setState({ error: 'Exception caught' });
      }
    });
  }

  loadData() {
    const { location: { search } } = this.props;
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    axios.get(`${this.apiUrl}/search${search}`).then((response) => {
      const newState = {
        currentUser: response.data.current_user,
      };
      newState.nodes = response.data.nodes;
      this.setState(newState);
    }).catch((error) => {
      if (error.response) {
        this.setState({ error: `${error.response.status} ${error.response.statusText}` });
      } else {
        console.log(error);
        this.setState({ error: 'Exception caught' });
      }
    });
  }

  resetState() {
    this.state = {
      currentUser: null,
      error: null,
    };
  }
}
SearchMedium.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default SearchMedium;
