import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

class FormPerson extends React.Component {
  constructor(props) {
    super(props);

    const { object: person } = props;
    this.state = { person: JSON.parse(JSON.stringify(person)) };
  }

  render = () => {
    const renderPersonName = (pn, index, setProperty) => {
      const { onChange } = this.props;
      const { person } = this.state;

      if (pn._destroy) {
        return null;
      }
      return (
        <tr key={index}>
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

    const { onChange } = this.props;
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
            {person.person_names.map(
              (pn, index) => renderPersonName(pn, index, (property, value) => {
                person.person_names[index][property] = value;
                onChange({ person });
              }),
            )}
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
            onChange({ person });
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
                    onChange({ person });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        { error }
      </div>
    );
  }
}
FormPerson.propTypes = {
  onChange: PropTypes.func.isRequired,
  object: PropTypes.shape(),
};
FormPerson.defaultProps = {
  object: {
    sex: null,
    person_names: [],
  },
};

export default FormPerson;
