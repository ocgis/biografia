import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { saveData } from './Requests';

class EditThing extends React.Component {
  constructor(props) {
    super(props);

    const { object: thing, referFrom } = props;
    this.state = { thing: JSON.parse(JSON.stringify(thing)) };
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
      saveData('Thing', this.state, handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const { thing, error } = this.state;

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
                  defaultValue={thing.name}
                  onChange={(event) => {
                    thing.name = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Typ:
              </td>
              <td>
                <Input
                  defaultValue={thing.kind}
                  onChange={(event) => {
                    thing.kind = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Märke:
              </td>
              <td>
                <Input
                  defaultValue={thing.make}
                  onChange={(event) => {
                    thing.make = event.target.value;
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                Serienummer:
              </td>
              <td>
                <Input
                  defaultValue={thing.serial}
                  onChange={(event) => {
                    thing.serial = event.target.value;
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
EditThing.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  object: PropTypes.shape(),
  referFrom: PropTypes.shape({
    _type_: PropTypes.string,
    id: PropTypes.number,
  }),
};
EditThing.defaultProps = {
  object: {
    name: null,
    kind: null,
    make: null,
    model: null,
    serial: null,
  },
  referFrom: null,
};

export default EditThing;