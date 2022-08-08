import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopMenu from './TopMenu';
import { apiUrl, webUrl } from './Mappings';
import { errorText, getRequest, postRequest } from './Requests';

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

  renderNodes = (nodes) => (
    Object.entries(nodes).map(([path, number]) => this.renderNode(path, number))
  );

  renderNode = (path, number) => {
    if (number == null) {
      return (
        <button
          key={path}
          type="button"
          onClick={() => this.registerImage(path)}
        >
          <img
            src={apiUrl('Medium', `file_thumb?file=${path}`)}
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
  };

  registerImage = (path) => {
    const handleResponse = (response) => {
      const { data: { medium } } = response;
      const { navigate } = this.props;

      if (medium != null) {
        navigate(webUrl('Medium', medium.id));
      } else {
        let { data: { error } } = response;
        if (error == null) {
          error = 'Missing medium in response';
        }
        this.setState({ error });
      }
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };

    const data = { file_name: path };
    postRequest(`${this.apiUrl}/register`, data, handleResponse, handleError);
  };

  loadData() {
    const { location: { search } } = this.props;

    const handleResponse = (response) => {
      const newState = {
        currentUser: response.data.current_user,
      };
      newState.nodes = response.data.nodes;
      this.setState(newState);
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };

    getRequest(`${this.apiUrl}/search${search}`, handleResponse, handleError);
  }

  resetState() {
    this.state = {
      currentUser: null,
      error: null,
    };
  }

  render() {
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
}
SearchMedium.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default function wrapper() {
  return (
    <SearchMedium
      location={useLocation()}
      navigate={useNavigate()}
    />
  );
}
