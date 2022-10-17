import { Button, Form, Input, notification, Col } from 'antd';
import React from 'react';
import { addMovie } from '../../services/apiCalls';
import useToken from '../../Hooks/useToken';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  const showError = (description) => {
    notification['error']({
      message: 'Login error',
      description: description,
    });
  };

  const onFinish = async (values) => {
    try {
      await addMovie(values.title, values.description, token)
      navigate('/')
    } catch (e) {
      showError("Could not add movie", e.response.data.detail)
    }
  };
  
  return (
    <>
    <div>Add Movie</div>
    <Col span={12} offset={6}>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please enter a movie title',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: 'Please enter a movie description',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Add Movie
        </Button>
      </Form.Item>
    </Form>
    </Col>
    </>
  );
};
export default AddMovie;