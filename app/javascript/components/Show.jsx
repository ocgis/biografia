import React from 'react';
import PropTypes from 'prop-types';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { ShowReferences } from './Reference';
import { apiUrl, oneName } from './Mappings';

class Show extends React.Component {
  constructor(props) {
    super(props);

    const { _type_ } = this.props;
    const objectName = oneName(_type_);
    this.state = {
      loadKey: 1,
      currentUser: null,
    };
    this.state[objectName] = null;
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      this.reload();
    }
  }

  reload = () => {
    const { loadKey } = this.state;
    this.setState({ loadKey: loadKey + 1 });
  };

  url = () => {
    const { match: { params: { id } }, _type_ } = this.props;
    return apiUrl(_type_, id);
  }

  render = () => {
    const { state } = this;
    const { _type_, showObject: ShowObject, noReferences } = this.props;
    const {
      currentUser, loadKey,
    } = state;
    const objectName = oneName(_type_);
    const object = state[objectName];

    const onLoaded = (data) => {
      this.setState(data);
    };

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <LoadData
          key={loadKey}
          url={this.url()}
          objectName={objectName}
          onLoaded={onLoaded}
        />
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
  showObject: PropTypes.func.isRequired,
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
