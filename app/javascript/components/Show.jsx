import React from 'react';
import PropTypes from 'prop-types';
import LoadData from './LoadData';
import TopMenu from './TopMenu';
import { ShowReferences } from './Reference';
import { apiUrl, oneName } from './Mappings';

class Show extends React.Component {
  constructor(props, showObject, _type_) {
    super(props);
    this._type_ = _type_;
    this.showObject = showObject;
    this.objectName = oneName(this._type_);
    this.state = {
      loadKey: 1,
      currentUser: null,
    };
    this.state[this.objectName] = null;
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
    const { match: { params: { id } } } = this.props;
    const { _type_ } = this;
    return apiUrl(_type_, id);
  }

  render = () => {
    const { _type_, state } = this;
    const { currentUser, showMode, loadKey } = this.state;
    const object = state[oneName(_type_)];
    const ShowObject = this.showObject;

    const onLoaded = (data) => {
      this.setState(data);
    };

    return (
      <div>
        <TopMenu currentUser={currentUser} />
        <LoadData
          key={loadKey}
          url={this.url()}
          objectName={this.objectName}
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
                      mode={showMode}
                      reload={this.reload}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ShowReferences
                      related={object.related}
                      currentUser={currentUser}
                      reload={this.reload}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
      </div>
    );
  }
}
Show.propTypes = {
  match: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default Show;
