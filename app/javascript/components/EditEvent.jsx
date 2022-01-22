import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormEvent from './FormEvent';

const EditEvent = (props) => {
  const {
    object, extraData, onOk, onCancel,
  } = props;

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
};
EditEvent.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditEvent.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditEvent;
