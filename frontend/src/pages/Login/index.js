import { Button, Form, Input, notification, Col } from 'antd';
import React from 'react';
import { login } from '../../services/apiCalls';
import { useNavigate } from 'react-router-dom';
import { showError } from '../../utils'
import { connect } from 'react-redux'
import { setAccessToken } from '../../redux/actions';

const Login = ({setAccessToken}) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    let res
    try {
      res = await login(values.username, values.password)
      setAccessToken(res.data.access_token)
      navigate('/')
    } catch (e) {
      showError("Login Error", e.response.data.detail)
    }
     await login(values.username, values.password)
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
            // type: "email",
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
          Login
        </Button>
      </Form.Item>
    </Form>
    </Col>
    </>
  );
};

export default connect(null, { setAccessToken })(Login);