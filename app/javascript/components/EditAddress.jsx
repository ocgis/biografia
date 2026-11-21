import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormAddress from './FormAddress';

function EditAddress({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Address"
      object={object}
      formObject={FormAddress}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditAddress.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditAddress;
