import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { FixedSizeGrid as Grid } from 'react-window';
import {
  Button, Checkbox, Descriptions, Dropdown, Input, Menu, Select,
} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'throttle-debounce';
import TopMenu from './TopMenu';
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

class SearchMedium extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      divRef: createRef(),
      error: null,
    };
    this.filter = '';
    this.scrollTop = 0;
    this.show = 'unregistered';
    this.flatten = false;
    this.path = 'files';

    this.apiUrl = apiUrl('Medium');

    if (props.location.state !== null) {
      this.scrollTop = props.location.state.scrollTop;
      this.filter = props.location.state.filter;
      this.show = props.location.state.show;
      this.flatten = props.location.state.flatten;
      this.path = props.location.state.path;
    }
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
        currentUser: response.data.current_user,
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

    const renderNode = (path, number) => {
      if (number == null) {
        return (
          <Button type="link" onClick={() => updatePath(path)} key={path} style={{ padding: 0 }}>
            <img
              src={apiUrl('Medium', `file_thumb?file=${path}`)}
              alt={path}
            />
          </Button>
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
      currentUser, error, nodes, type, path, info,
    } = this.state;

    const showOptions = [
      { value: 'unregistered', label: 'Unregistered' },
      { value: 'all', label: 'All' },
      { value: 'registered', label: 'Registered' },
    ];
    if (type === 'file') {
      const menu = (
        <Menu onClick={() => this.registerImage()}>
          <Menu.Item key="add">
            Lägg till
          </Menu.Item>
        </Menu>
      );

      const src = apiUrl('Medium', `file_image?file=${path}`);
      const link = apiUrl('Medium', `file_raw?file=${path}`);

      return (
        <table>
          <tbody>
            <tr>
              <td aria-label="Top menu">
                <TopMenu currentUser={currentUser} />
                <PathSelector path={path} updatePath={updatePath} />
              </td>
            </tr>
            <tr>
              <td aria-label="Options menu">
                <Dropdown overlay={menu} trigger="click">
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
      <div>
        <TopMenu currentUser={currentUser} />
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
      </div>
    );
  }
}
SearchMedium.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    state: PropTypes.shape().isRequired,
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
