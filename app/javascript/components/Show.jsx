import React from 'react';
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import TopMenu from './TopMenu';
import { loadData } from './Requests';
import { ShowReferences } from './Reference';
import {
  apiUrl, webUrl, oneName, showObject,
} from './Mappings';

class Show extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = oneName(_type_);
    this.state = {
      currentUser: null,
      timerHandle: null,
      history: {
        showReferences: {},
      },
      context: {
        collection: null,
        collectionIndex: 0,
      },
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

  setNavigateState = (newState) => {
    const {
      navigate,
      location: {
        state: oldState,
        pathname,
        search,
      },
    } = this.props;

    const navigateState = {
      state: {
        ...oldState,
        ...newState,
      },
      replace: true,
    };
    const url = pathname + search;
    navigate(url, navigateState);
  };

  render() {
    const setHistory = (s) => {
      this.setState({ history: s });
      this.setNavigateState({ history: s });
    };

    const navigateContext = () => {
      const { context: { collection, collectionIndex } } = this.state;
      if (collection != null) {
        const collectionSize = collection.length;
        let prevNavigate = null;
        if (collectionIndex > 0) {
          const prevCollectionIndex = collectionIndex - 1;
          const prevObject = collection[prevCollectionIndex];
          const context = { collection, collectionIndex: prevCollectionIndex };
          prevNavigate = (
            <Link to={webUrl(prevObject._type_, prevObject.id)} state={{ context }} replace>
              <LeftOutlined />
            </Link>
          );
        }
        let nextNavigate = null;
        if (collectionIndex < collectionSize - 1) {
          const nextCollectionIndex = collectionIndex + 1;
          const nextObject = collection[nextCollectionIndex];
          const context = { collection, collectionIndex: nextCollectionIndex };
          nextNavigate = (
            <Link to={webUrl(nextObject._type_, nextObject.id)} state={{ context }} replace>
              <RightOutlined />
            </Link>
          );
        }
        return (
          <>
            { prevNavigate }
            { `${collectionIndex + 1} av ${collectionSize}` }
            { nextNavigate }
          </>
        );
      }
      return null;
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
        <TopMenu />
        { error != null
          && (
            <Alert message={error} type="error" showIcon />
          )}
        { object != null
          && (
            <>
              { navigateContext() }
              <table>
                <tbody>
                  <tr>
                    <td aria-label="object">
                      <ShowObject
                        key={`${object._type_}_${object.id}`}
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
                        <td aria-label="references">
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
            </>
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
