import { Button, Form, Input, notification, Col } from 'antd';
import React from 'react';
import { login } from '../../services/apiCalls';
import useToken from '../../Hooks/useToken';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setToken } = useToken();
  const navigate = useNavigate();

  const showError = (description) => {
    notification['error']({
      message: 'Login error',
      description: description,
    });
  };

  const onFinish = (values) => {
    login(values.username, values.password)
    .then(res => {
      setToken(res.data)
      navigate('/')
    })
    .catch(err => {
      showError(err.response.data.detail)
    })
  };
  
  return (
    <>
    <div>Movierama</div>
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
        label="Email"
        name="username"
        rules={[
          {
            required: true,
            type: "email",
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </Col>
    </>
  );
};
export default Login;