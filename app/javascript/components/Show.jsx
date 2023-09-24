import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
      timerHandle: null,
      history: { showReferences: {} },
    };
    this.state[objectName] = null;
    if (props.location.state !== null) {
      this.state = {
        ...this.state,
        ...props.location.state,
      };
    }
  }

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search, state } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      const { timerHandle } = this.state;
      if (timerHandle !== null) {
        clearTimeout(timerHandle);
      }
      if (state !== null) {
        this.setState(state);
      } else {
        this.setState({ history: {} });
      }
      this.reload();
    }
  }

  componentWillUnmount() {
    const { timerHandle } = this.state;
    if (timerHandle !== null) {
      clearTimeout(timerHandle);
    }
  }

  reload = () => {
    const { _type_, reloadInterval } = this.props;
    const objectName = oneName(_type_);

    const onLoaded = (data) => {
      this.setState(data);
    };

    loadData(this.url(), objectName, onLoaded, false);

    if (reloadInterval > 0) {
      this.state.timerHandle = setTimeout(this.reload, reloadInterval);
    }
  };

  url = () => {
    const { params: { id }, _type_ } = this.props;
    return apiUrl(_type_, id);
  };

  render() {
    const setHistory = (s) => {
      this.setState({ history: s });

      const { navigate, location } = this.props;
      const { history } = this.state;
      const navigateState = { state: { history: { ...history, ...s } }, replace: true };
      const url = location.pathname + location.search;
      navigate(url, navigateState);
    };
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
                          object={object}
                          currentUser={currentUser}
                          reload={this.reload}
                          state={state.history.showReferences || {}}
                          setState={(s) => setHistory({ showReferences: s })}
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
  params: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    key: PropTypes.string,
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    state: PropTypes.shape(),
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  reloadInterval: PropTypes.number,
};
Show.defaultProps = {
  noReferences: false,
  reloadInterval: 0,
};

export default function wrapper(props) {
  return (
    <Show
      {...props}
      params={useParams()}
      location={useLocation()}
      navigate={useNavigate()}
    />
  );
}
