import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormPerson from './FormPerson';

function EditPerson({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Person"
      object={object}
      formObject={FormPerson}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditPerson.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditPerson;
