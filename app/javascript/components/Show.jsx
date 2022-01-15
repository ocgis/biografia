import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import TopMenu from './TopMenu';
import { loadData } from './Requests';
import { ShowReferences } from './Reference';
import { apiUrl, oneName, showObject } from './Mappings';

class Show extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = oneName(_type_);
    this.state = {
      currentUser: null,
    };
    this.state[objectName] = null;
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
    const { _type_ } = this.props;
    const objectName = oneName(_type_);

    const onLoaded = (data) => {
      this.setState(data);
    };

    loadData(this.url(), objectName, onLoaded, false);
  };

  url = () => {
    const { match: { params: { id } }, _type_ } = this.props;
    return apiUrl(_type_, id);
  }

  render = () => {
    const { state } = this;
    const { _type_, noReferences } = this.props;
    const {
      currentUser, error,
    } = state;
    const ShowObject = showObject(_type_);
    const objectName = oneName(_type_);
    const object = state[objectName];

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        { error != null
          && (
            <Alert message={error} type="error" showIcon />
          )}
        { object != null
          && (
            <table>
              <tbody>
                <tr>
                  <td>
                    <ShowObject
                      object={object}
                      currentUser={currentUser}
                      mode="full"
                      reload={this.reload}
                    />
                  </td>
                </tr>
                { !noReferences
                  && (
                    <tr>
                      <td>
                        <ShowReferences
                          related={object.related}
                          currentUser={currentUser}
                          reload={this.reload}
                        />
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          )}
      </div>
    );
  }
}
Show.propTypes = {
  _type_: PropTypes.string.isRequired,
  noReferences: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
Show.defaultProps = {
  noReferences: false,
};

export default Show;
