import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormEstablishment from './FormEstablishment';

function EditEstablishment(props) {
  const {
    object, extraData, onOk, onCancel,
  } = props;

  return (
    <Edit
      _type_="Establishment"
      object={object}
      formObject={FormEstablishment}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditEstablishment.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditEstablishment.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditEstablishment;
