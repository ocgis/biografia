import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormThing from './FormThing';

function EditThing({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Thing"
      object={object}
      formObject={FormThing}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditThing.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditThing;
