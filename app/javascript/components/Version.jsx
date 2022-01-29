import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import TopMenu from './TopMenu';
import { loadData } from './Requests';
import { apiUrl, showObject } from './Mappings';

class Version extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      versions: null,
    };
  }

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      this.reload();
    }
  }

  reload = () => {
    const onLoaded = (data) => {
      const { currentUser, versions } = data;
      this.setState({ currentUser, versions });
    };

    loadData(this.url(), 'versions', onLoaded, false);
  };

  url = () => {
    const { match: { params: { id } }, _type_ } = this.props;
    return apiUrl(_type_, id, 'examine');
  }

  render = () => {
    const { state } = this;
    const { _type_ } = this.props;
    const {
      currentUser, error,
    } = state;
    const ShowObject = showObject(_type_);
    const { versions } = state;

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        { error != null
          && (
            <Alert message={error} type="error" showIcon />
          )}
        { versions != null
          && (
            <table>
              <tbody>
                { versions.map((version) => (
                  <tr key={version.version.id}>
                    <td>
                      <ShowObject
                        object={version}
                        currentUser={currentUser}
                        mode="full"
                        reload={this.reload}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    );
  }
}
Version.propTypes = {
  _type_: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default Version;
