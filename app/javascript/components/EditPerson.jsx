import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import SaveData from './SaveData';

class EditPerson extends SaveData {
  constructor(props) {
    super(props);
    this.objectName = 'person';
    this.apiUrl = '/api/v1/people';

    const { person } = props;
    this.state = { person: JSON.parse(JSON.stringify(person)) };
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
      this.saveData(handleResult);
    };

    const closeButtonClicked = () => {
      const { onCancel } = this.props;
      onCancel();
    };

    const renderPersonName = (pn, setProperty) => {
      const { person } = this.state;

      if (pn._destroy) {
        return null;
      }
      return (
        <tr key={pn.id}>
          <td>
            <Input
              defaultValue={pn.given_name}
              onChange={(event) => setProperty('given_name', event.target.value)}
            />
          </td>
          <td>
            <Input
              defaultValue={pn.calling_name}
              onChange={(event) => setProperty('calling_name', event.target.value)}
            />
          </td>
          <td>
            <Input
              defaultValue={pn.surname}
              onChange={(event) => setProperty('surname', event.target.value)}
            />
          </td>
          <td>
            <CloseOutlined
              onClick={() => {
                setProperty('_destroy', true);
                this.setState({ person });
              }}
            />
          </td>
        </tr>
      );
    };

    const { person, error } = this.state;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>
                Förnamn
              </th>
              <th>
                Tilltalsnamn
              </th>
              <th>
                Efternamn
              </th>
            </tr>
          </thead>
          <tbody>
            {person.person_names.map((pn, index) => renderPersonName(pn, (property, value) => {
              person.person_names[index][property] = value;
            }))}
          </tbody>
        </table>
        <PlusOutlined
          onClick={() => {
            person.person_names.push({
              given_name: null,
              calling_name: null,
              surname: null,
            });
            this.setState({ person });
          }}
        />
        <table>
          <tbody>
            <tr>
              <td>
                Kön:
              </td>
              <td>
                <Input
                  defaultValue={person.sex}
                  onChange={(event) => {
                    person.sex = event.target.value;
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
EditPerson.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  person: PropTypes.shape(),
};
EditPerson.defaultProps = {
  person: {
    sex: null,
    person_names: [],
  },
};

export default EditPerson;
