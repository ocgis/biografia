import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormNote from './FormNote';

const EditNote = (props) => {
  const {
    object, extraData, onOk, onCancel,
  } = props;

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
};
EditNote.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditNote.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditNote;
