import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeGrid as Grid } from 'react-window';
import {
  Button, Checkbox, Descriptions, Dropdown, Input, Select,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'throttle-debounce';
import DisplayMedium from './DisplayMedium';
import { apiUrl, webUrl } from './Mappings';
import { errorText, postRequest } from './Requests';

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

function HandleOneMedium(props) {
  const {
    path, updatePath, registerImage, info, error,
  } = props;
  const menu = {
    items: [{
      key: 'add',
      label: 'Lägg till',
    }],
    onClick: ((element) => {
      if (element.key === 'add') {
        registerImage();
      }
    }),
  };

  const src = apiUrl('Medium', `file_image?file=${path}`);
  const link = apiUrl('Medium', `file_raw?file=${path}`);

  return (
    <table>
      <tbody>
        <tr>
          <td aria-label="Path selector">
            <PathSelector path={path} updatePath={updatePath} />
          </td>
        </tr>
        <tr>
          <td aria-label="Options menu">
            <Dropdown menu={menu} trigger="click">
              <PlusCircleOutlined />
            </Dropdown>
          </td>
        </tr>
        <tr>
          <td aria-label="Display medium">
            <DisplayMedium
              src={src}
              alt={path}
              contentType={info.content_type}
              link={link}
            />
          </td>
        </tr>
        <tr>
          <td aria-label="Information">
            <Info data={info} />
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
HandleOneMedium.propTypes = {
  path: PropTypes.string.isRequired,
  info: PropTypes.shape().isRequired,
  updatePath: PropTypes.func.isRequired,
  registerImage: PropTypes.func.isRequired,
  error: PropTypes.string,
};
HandleOneMedium.defaultProps = {
  error: null,
};

class SelectMedium extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      divRef: createRef(),
      error: null,
    };

    this.apiUrl = apiUrl('Medium');

    const locationState = props.location.state || {};
    this.scrollTop = locationState.scrollTop || 0;
    this.filter = locationState.filter || '';
    this.show = locationState.show || 'unregistered';
    this.flatten = locationState.flatten || false;
    this.path = locationState.path || 'files';
    this.state.selectedPaths = locationState.selectedPaths || [];
  }

  componentDidMount() {
    this.loadData();
    window.addEventListener('resize', this.updateHeights);
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
    const { divRef } = this.state;
    if (divRef != null && divRef.current != null) {
      const { top } = divRef.current.getBoundingClientRect();
      const { height: oldHeight } = this.state;

      const height = window.innerHeight - top;
      if (height !== oldHeight) {
        this.setState({ height });
      }
    }
  };

  saveNavigateState = () => {
    const { location, navigate } = this.props;
    const { selectedPaths } = this.state;
    const url = location.pathname;
    const state = {
      state: {
        filter: this.filter,
        scrollTop: this.scrollTop,
        show: this.show,
        flatten: this.flatten,
        path: this.path,
        selectedPaths,
      },
      replace: true,
    };
    navigate(url, state);
  };

  registerImage = () => {
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

    const { path } = this.state;
    const data = { file_name: path };
    postRequest(`${this.apiUrl}/register`, data, handleResponse, handleError);
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

    const updatePath = (path) => {
      this.path = path;
      this.saveNavigateState();
      this.loadData();
    };

    const selectPath = (path) => {
      this.setState((prevState) => ({
        selectedPaths: prevState.selectedPaths.concat(path),
      }));
    };

    const unselectPath = (path) => {
      this.setState((prevState) => ({
        selectedPaths: prevState.selectedPaths.filter((element) => element !== path),
      }));
    };

    const renderSelectUnselect = (path) => {
      const { selectedPaths } = this.state;

      const index = selectedPaths.findIndex((element) => element === path);
      if (index >= 0) {
        return (
          <button
            type="button"
            className="selected"
            style={{ position: 'absolute' }}
            onClick={() => unselectPath(path)}
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
          onClick={() => selectPath(path)}
        >
          #
        </button>
      );
    };

    const renderNode = (path, number) => {
      if (number == null) {
        const { selectable } = this.props;
        return (
          <div>
            <Button
              type="link"
              onClick={() => updatePath(path)}
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
            { selectable && renderSelectUnselect(path) }
          </div>
        );
      }
      return (
        <React.Fragment key={path}>
          <Button type="link" onClick={() => updatePath(path)} key={path} style={{ padding: 0 }}>
            {`${path} (${number})`}
          </Button>
          <br />
        </React.Fragment>
      );
    };

    const renderNodes = (nodes) => (
      Object.entries(nodes).filter(
        (item) => (item[1] != null),
      ).map(
        ([path, number]) => renderNode(path, number),
      )
    );

    const renderLeafs = (nodes) => {
      const { divRef, height } = this.state;
      const leafs = Object.entries(nodes).filter(
        (item) => (item[1] == null),
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
      error, nodes, type, path, info,
    } = this.state;

    const showOptions = [
      { value: 'unregistered', label: 'Unregistered' },
      { value: 'all', label: 'All' },
      { value: 'registered', label: 'Registered' },
    ];
    if (type === 'file') {
      return (
        <HandleOneMedium
          path={path}
          info={info}
          registerImage={this.registerImage}
          updatePath={updatePath}
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
  selectable: PropTypes.bool,
};
SelectMedium.defaultProps = {
  selectable: false,
};

export default SelectMedium;
