import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

class AddPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const handleResponse = (person) => {
      const { onFinish } = this.props;
      console.log(person);
      onFinish(person);
    };

    const handleError = (error) => {
      this.setState({ error: error.toString() });
    };

    const onFinish = (person) => {
      console.log(person);

      const csrfToken = document.querySelector('[name=csrf-token]').content;
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

      axios.post('/api/v1/people', { person })
        .then((response) => handleResponse(response))
        .catch((error) => handleError(error));
    };

    const { error } = this.state;

    return (
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="sex"
          >
            <Input placeholder="Kön" />
          </Form.Item>
          <Form.List
            name="person_names_attributes"
            initialValue={[{ given_name: 'Init' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({
                  key, name, fieldKey,
                }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      name={[name, '_delete']}
                      initialValue={false}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'given_name']}
                      fieldKey={[fieldKey, 'given_name']}
                    >
                      <Input placeholder="Förnamn" />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'calling_name']}
                      fieldKey={[fieldKey, 'calling_name']}
                    >
                      <Input placeholder="Tilltalsnamn" />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'surname']}
                      fieldKey={[fieldKey, 'surname']}
                    >
                      <Input placeholder="Efternamn" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Lägg till namn
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ok
            </Button>
          </Form.Item>
        </Form>
        { error }
      </div>
    );
  }
}
AddPerson.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export { AddPerson };
