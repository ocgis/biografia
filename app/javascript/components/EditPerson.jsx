import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormPerson from './FormPerson';

const EditPerson = (props) => {
  const {
    object, extraData, onOk, onCancel,
  } = props;

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
};
EditPerson.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditPerson.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditPerson;
