import React, { createRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FixedSizeGrid as Grid } from 'react-window';
import {
  Button, Checkbox, Descriptions, Dropdown, Input, Select,
} from 'antd';
import { PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { debounce } from 'throttle-debounce';
import DisplayMedium from './DisplayMedium';
import { apiUrl, oneName, showObject } from './Mappings';
import { errorText, postRequest, loadData } from './Requests';
import { ShowReferences } from './Reference';

const { Search } = Input;

function Info(props) {
  const { data } = props;

  const titleCase = (s) => s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => ` ${c.toUpperCase()}`);

  if (data == null) {
    return null;
  }

  const tags = [];
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value.constructor === String) {
      tags.push((
        <Descriptions.Item
          key={key}
          label={titleCase(key)}
        >
          {value}
        </Descriptions.Item>
      ));
    } else if (value.constructor === Object) {
      tags.push((
        <Descriptions.Item
          key={key}
          label={titleCase(key)}
        >
          <Info data={value} />
        </Descriptions.Item>
      ));
    }
  });

  return (
    <Descriptions
      layout="vertical"
    >
      {tags}
    </Descriptions>
  );
}

Info.propTypes = {
  data: PropTypes.shape(),
};

Info.defaultProps = {
  data: null,
};

function PathSelector(props) {
  const { path, updatePath } = props;

  const dirs = path.split('/');
  let fullPath = '';
  const paths = dirs.map((d) => {
    fullPath = fullPath.concat(`${d}/`);
    return {
      dir: d,
      path: fullPath.slice(0, -1),
    };
  });

  return paths.map((p) => (
    <Button type="link" onClick={() => updatePath(p.path)} key={p.path} style={{ padding: 0 }}>
      {`${p.dir}/`}
    </Button>
  ));
}

function PresentUnregisteredMedium(props) {
  const {
    medium, goBack, registerImage, error,
  } = props;
  const menu = {
    items: [{
      key: 'add',
      label: 'Lägg till',
    }],
    onClick: ((element) => {
      if (element.key === 'add') {
        registerImage(medium.file_name);
      }
    }),
  };

  const src = apiUrl('Medium', `file_image?file=${medium.file_name}`);
  const link = apiUrl('Medium', `file_raw?file=${medium.file_name}`);

  return (
    <table>
      <tbody>
        <tr>
          <td aria-label="Options">
            <RollbackOutlined onClick={goBack} />
            <Dropdown menu={menu} trigger="click">
              <PlusCircleOutlined />
            </Dropdown>
          </td>
        </tr>
        <tr>
          <td aria-label="Display medium">
            <DisplayMedium
              src={src}
              alt={medium.file_name}
              contentType={medium.info.content_type}
              link={link}
            />
          </td>
        </tr>
        <tr>
          <td aria-label="Information">
            <Info data={medium.info} />
          </td>
        </tr>
        <tr>
          <td>
            { error && error }
          </td>
        </tr>
      </tbody>
    </table>
  );
}
PresentUnregisteredMedium.propTypes = {
  medium: PropTypes.shape({
    file_name: PropTypes.string.isRequired,
    info: PropTypes.shape().isRequired,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
  registerImage: PropTypes.func.isRequired,
  error: PropTypes.string,
};
PresentUnregisteredMedium.defaultProps = {
  error: null,
};

function PresentRegisteredMedium(props) {
  const {
    medium, goBack, error, currentUser, reload,
  } = props;
  const ShowMedium = showObject(medium._type_);
  const [refTabState, setRefTabState] = useState({});

  return (
    <table>
      <tbody>
        <tr>
          <td aria-label="Options">
            <RollbackOutlined onClick={goBack} />
          </td>
        </tr>
        <tr>
          <td aria-label="object">
            <ShowMedium
              object={medium}
              currentUser={currentUser}
              mode="full"
              reload={reload}
            />
          </td>
        </tr>
        <tr>
          <td aria-label="references">
            <ShowReferences
              object={medium}
              currentUser={currentUser}
              reload={reload}
              state={refTabState}
              setState={setRefTabState}
            />
          </td>
        </tr>
        <tr>
          <td>
            { error && error }
          </td>
        </tr>
      </tbody>
    </table>
  );
}
PresentRegisteredMedium.propTypes = {
  medium: PropTypes.shape({
    _type_: PropTypes.string.isRequired,
    file_name: PropTypes.string.isRequired,
    info: PropTypes.shape().isRequired,
  }).isRequired,
  reload: PropTypes.func.isRequired,
  currentUser: PropTypes.shape().isRequired,
  goBack: PropTypes.func.isRequired,
  error: PropTypes.string,
};
PresentRegisteredMedium.defaultProps = {
  error: null,
};

class SelectMedium extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      divRef: createRef(),
      error: null,
      selectedMedia: [],
    };

    this.apiUrl = apiUrl('Medium');

    const locationState = props.location.state || {};
    this.scrollTop = locationState.scrollTop || 0;
    this.filter = locationState.filter || '';
    this.show = locationState.show || 'unregistered';
    this.flatten = locationState.flatten || false;
    this.path = locationState.path || 'files';
    this.state.presentedMedium = locationState.presentedMedium || null;

    const currentUserUrl = apiUrl('users', 'current');
    const currentUserLoaded = (data) => {
      if (data.error !== null) {
        this.setState({ error: errorText(data.error) });
      } else {
        const { currentUser } = data;
        this.setState({ currentUser });
      }
    };
    loadData(currentUserUrl, 'currentUser', currentUserLoaded, false);
  }

  componentDidMount() {
    this.loadData();
    window.addEventListener('resize', this.updateHeights);
    const { onChange } = this.props;
    const { selectedMedia } = this.state;
    onChange(selectedMedia);
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, search } } = this.props;
    if (pathname !== prevProps.location.pathname
        || search !== prevProps.location.search) {
      this.loadData();
    }

    this.updateHeights();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeights);
  }

  updateHeights = () => {
    const { bottomMargin } = this.props;
    const { divRef } = this.state;
    if (divRef != null && divRef.current != null) {
      const { top } = divRef.current.getBoundingClientRect();
      const { height: oldHeight } = this.state;

      const height = window.innerHeight - top - bottomMargin;
      if (height !== oldHeight) {
        this.setState({ height });
      }
    }
  };

  saveNavigateState = () => {
    const { location, navigate } = this.props;
    const { selectedMedia } = this.state;
    const url = location.pathname;
    const state = {
      state: {
        filter: this.filter,
        scrollTop: this.scrollTop,
        show: this.show,
        flatten: this.flatten,
        path: this.path,
      },
      replace: true,
    };
    navigate(url, state);
  };

  loadData() {
    const handleResponse = (response) => {
      const newState = {
        type: response.data.type,
        path: null,
        nodes: null,
        info: null,
      };
      if (newState.type === 'directory') {
        newState.path = response.data.path;
        newState.nodes = response.data.nodes;
      } else if (newState.type === 'file') {
        newState.path = response.data.path;
        newState.info = response.data.info;
      }
      this.setState(newState);
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };

    postRequest(
      `${this.apiUrl}/search`,
      {
        path: this.path,
        filter: this.filter,
        show: this.show,
        flatten: this.flatten,
      },
      handleResponse,
      handleError,
    );
  }

  loadMediumInfo(path) {
    const handleResponse = (response) => {
      const { info } = response.data;
      const presentedMedium = { file_name: path, info };
      this.setState({ presentedMedium });
    };

    const handleError = (error) => {
      this.setState({ error: errorText(error) });
    };

    postRequest(
      `${this.apiUrl}/info`,
      {
        path,
      },
      handleResponse,
      handleError,
    );
  }

  loadMedium(id) {
    const onLoaded = (data) => {
      if (data.error !== null) {
        this.setState({ error: errorText(data.error) });
      } else {
        const { medium: presentedMedium } = data;
        this.setState({ presentedMedium });
      }
    };

    const objectName = oneName('Medium');
    const url = apiUrl('Medium', id);

    loadData(url, objectName, onLoaded, false);
  }

  render() {
    const updateFilter = debounce(500, (data) => {
      this.filter = data.target.value;
      this.saveNavigateState();
      this.loadData();
    });

    const updateShow = (value) => {
      this.show = value;
      this.saveNavigateState();
      this.loadData();
    };

    const updateFlatten = (value) => {
      this.flatten = value.target.checked;
      this.saveNavigateState();
      this.loadData();
    };

    const registerImage = (path) => {
      const handleResponse = (response) => {
        const { data: { medium } } = response;

        if (medium != null) {
          this.loadMedium(medium.id);
          this.loadData();
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

    const updatePath = (path) => {
      this.path = path;
      this.saveNavigateState();
      this.loadData();
    };

    const selectMedium = (medium) => {
      this.setState((prevState) => {
        const selectedMedia = prevState.selectedMedia.concat(medium);
        const { onChange } = this.props;
        onChange(selectedMedia);
        return ({ selectedMedia });
      });
    };

    const unselectMedium = (medium) => {
      this.setState((prevState) => {
        const selectedMedia = prevState.selectedMedia.filter((element) => element.file_name
          !== medium.file_name);
        const { onChange } = this.props;
        onChange(selectedMedia);
        return ({ selectedMedia });
      });
    };

    const renderSelectUnselect = (medium) => {
      const { selectedMedia } = this.state;

      const index = selectedMedia.findIndex((element) => element.file_name === medium.file_name);
      if (index >= 0) {
        return (
          <button
            type="button"
            className="selected"
            style={{ position: 'absolute' }}
            onClick={() => unselectMedium(medium)}
          >
            {index + 1}
          </button>
        );
      }
      return (
        <button
          type="button"
          className="unselected"
          style={{ position: 'absolute' }}
          onClick={() => selectMedium(medium)}
        >
          #
        </button>
      );
    };

    const renderNode = (path, attributes) => {
      if (attributes.children > 0) {
        return (
          <React.Fragment key={path}>
            <Button type="link" onClick={() => updatePath(path)} key={path} style={{ padding: 0 }}>
              {`${path} (${attributes.children})`}
            </Button>
            <br />
          </React.Fragment>
        );
      }

      const { selectable } = this.props;

      if ('id' in attributes) {
        return (
          <div>
            <Button
              type="link"
              onClick={() => this.loadMedium(attributes.id)}
              key={path}
              style={{
                padding: 0,
                position: 'absolute',
              }}
            >
              <img
                src={apiUrl('Medium', attributes.id, 'thumb')}
                alt={path}
              />
            </Button>
            { selectable && renderSelectUnselect({ file_name: path, id: attributes.id }) }
          </div>
        );
      }

      return (
        <div>
          <Button
            type="link"
            onClick={() => this.loadMediumInfo(path)}
            key={path}
            style={{
              padding: 0,
              position: 'absolute',
            }}
          >
            <img
              src={apiUrl('Medium', `file_thumb?file=${path}`)}
              alt={path}
            />
          </Button>
          { selectable && renderSelectUnselect({ file_name: path }) }
        </div>
      );
    };

    const renderNodes = (nodes) => (
      Object.entries(nodes).filter(
        (item) => (item[1].children > 0),
      ).map(
        ([path, attributes]) => renderNode(path, attributes),
      )
    );

    const renderLeafs = (nodes) => {
      const { divRef, height } = this.state;
      const leafs = Object.entries(nodes).filter(
        (item) => (item[1].children === 0),
      );
      const mediumWidth = 120;
      const mediumHeight = 120;
      const width = window.innerWidth;
      const columnCount = Math.trunc(width / mediumWidth);
      const rowCount = Math.trunc((leafs.length + columnCount - 1) / columnCount);

      const renderCell = ({ columnIndex, rowIndex, style }) => {
        const index = columnIndex + rowIndex * columnCount;
        return (
          <div
            style={style}
          >
            {
              index < leafs.length
              && renderNode(leafs[index][0], leafs[index][1])
            }
          </div>
        );
      };

      return (
        <div ref={divRef}>
          { height != null
            && (
              <Grid
                columnCount={columnCount}
                columnWidth={mediumWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={mediumHeight}
                width={window.innerWidth}
                onScroll={(p) => {
                  this.scrollTop = p.scrollTop;
                  this.saveNavigateState();
                }}
                initialScrollTop={this.scrollTop}
              >
                {renderCell}
              </Grid>
            )}
        </div>
      );
    };

    const {
      error, nodes, path, presentedMedium,
    } = this.state;

    const showOptions = [
      { value: 'unregistered', label: 'Unregistered' },
      { value: 'all', label: 'All' },
      { value: 'registered', label: 'Registered' },
    ];

    if (presentedMedium !== null) {
      if ('id' in presentedMedium) {
        const { currentUser } = this.state;
        return (
          <PresentRegisteredMedium
            medium={presentedMedium}
            reload={() => this.loadMedium(presentedMedium.id)}
            currentUser={currentUser}
            goBack={() => {
              this.setState({ presentedMedium: null });
            }}
            error={error}
          />
        );
      }

      return (
        <PresentUnregisteredMedium
          medium={presentedMedium}
          registerImage={registerImage}
          goBack={() => {
            this.setState({ presentedMedium: null });
          }}
          error={error}
        />
      );
    }

    let nodesAndLeafs = null;
    if (nodes != null) {
      nodesAndLeafs = (
        <>
          {renderNodes(nodes)}
          {renderLeafs(nodes)}
        </>
      );
    }

    return (
      <>
        <table>
          <tbody>
            <tr>
              <td>
                <Checkbox onChange={updateFlatten} defaultChecked={this.flatten}>Flatten</Checkbox>
              </td>
              <td aria-label="Show">
                <Select defaultValue={this.show} onChange={updateShow} options={showOptions} />
              </td>
              <td aria-label="Filter">
                <Search placeholder="filtrera" defaultValue={this.filter} onChange={updateFilter} />
              </td>
            </tr>
            {path
            && (
              <tr>
                <td aria-label="Path">
                  <PathSelector path={path} updatePath={updatePath} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <br />
        {nodesAndLeafs}
        { error && error }
      </>
    );
  }
}
SelectMedium.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    state: PropTypes.shape(),
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  selectable: PropTypes.bool.isRequired,
  bottomMargin: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
SelectMedium.defaultProps = {
};

function SelectMediumWrapper(props) {
  const { selectable, bottomMargin, onChange } = props;
  return (
    <SelectMedium
      location={useLocation()}
      navigate={useNavigate()}
      selectable={selectable}
      bottomMargin={bottomMargin}
      onChange={onChange}
    />
  );
}
SelectMediumWrapper.propTypes = {
  selectable: PropTypes.bool,
  bottomMargin: PropTypes.number,
  onChange: PropTypes.func,
};
SelectMediumWrapper.defaultProps = {
  selectable: false,
  bottomMargin: 0,
  onChange: (selectedMedia) => { console.log(selectedMedia); },
};

export default SelectMediumWrapper;
