import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class EditRelationship extends React.Component {
  constructor(props) {
    super(props);

    const { object: relationship, referFrom } = props;
    this.state = { relationship: JSON.parse(JSON.stringify(relationship)) };
    if (referFrom != null) {
      this.state.referFrom = {
        _type_: referFrom._type_,
        id: referFrom.id,
      };
    }
  }

  render = () => {
    const handleResult = (result) => {
      const { onOk } = this.props;
      if (result.error == null) {
        onOk(result);
      } else {
        this.setState({ error: result.error });
      }
    };

    const okButtonClicked = () => {
      saveData('Relationship', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { relationship, error } = this.state;

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Namn:
              </td>
              <td>
                <Input
                  defaultValue={relationship.name}
                  onChange={(event) => {
                    relationship.name = event.target.value;
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <CheckOutlined onClick={okButtonClicked} />
        <CloseOutlined onClick={closeButtonClicked} />
        { error }
      </div>
    );
  }
}
EditRelationship.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditRelationship.defaultProps = {
  object: {
    name: null,
  },
  referFrom: null,
};

export default EditRelationship;
