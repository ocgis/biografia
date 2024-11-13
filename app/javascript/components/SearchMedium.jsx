import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import TopMenu from './TopMenu';
import SelectMedium from './SelectMedium';

function SearchMedium(props) {
  const { location, navigate, selectable } = props;
  return (
    <div>
      <TopMenu />
      <SelectMedium
        location={location}
        navigate={navigate}
        selectable={selectable}
      />
    </div>
  );
}
SearchMedium.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    state: PropTypes.shape(),
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
};
SearchMedium.defaultProps = {
  selectable: false,
};

export default function wrapper() {
  return (
    <SearchMedium
      location={useLocation()}
      navigate={useNavigate()}
    />
  );
}
