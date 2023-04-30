import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormEventDate from './FormEventDate';

function EditEventDate(props) {
  const {
    object, extraData, onOk, onCancel,
  } = props;

  return (
    <Edit
      _type_="EventDate"
      object={object}
      formObject={FormEventDate}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditEventDate.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditEventDate.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditEventDate;
