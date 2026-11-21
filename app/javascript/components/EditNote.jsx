import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormNote from './FormNote';

function EditNote({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Note"
      object={object}
      formObject={FormNote}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditNote.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditNote;
