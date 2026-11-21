import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormMedium from './FormMedium';

function EditMedium({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Medium"
      object={object}
      formObject={FormMedium}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditMedium.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditMedium;
