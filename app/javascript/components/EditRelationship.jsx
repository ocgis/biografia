import React from 'react';
import PropTypes from 'prop-types';
import Edit from './Edit';
import FormRelationship from './FormRelationship';

const EditRelationship = (props) => {
  const {
    object, extraData, onOk, onCancel,
  } = props;

  return (
    <Edit
      _type_="Relationship"
      object={object}
      formObject={FormRelationship}
      onOk={onOk}
      onCancel={onCancel}
      extraData={extraData}
    />
  );
};
EditRelationship.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  extraData: PropTypes.shape(),
};
EditRelationship.defaultProps = {
  object: undefined,
  extraData: undefined,
};

export default EditRelationship;
