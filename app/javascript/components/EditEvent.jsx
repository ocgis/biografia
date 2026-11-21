import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormEvent from './FormEvent';

function EditEvent({
  object = undefined, extraData = undefined, onOk, onCancel,
}) {
  return (
    <Edit
      _type_="Event"
      object={object}
      formObject={FormEvent}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
}
EditEvent.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};

export default EditEvent;
