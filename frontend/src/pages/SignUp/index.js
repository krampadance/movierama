import { Button, Col, Form, Input } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { signup } from '../../services/apiCalls';
import { showError } from '../../utils';

function SignUp() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await signup(values.username, values.password, values.firstName, values.lastName);
      navigate('/login');
    } catch (e) {
      showError('Error during signup', e.response.data.detail || e);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <div>Movierama</div>
      <Col span={12} offset={6}>
        <Form
          name="basic"
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 16
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                // TODO: dont forget to tmove comment and in login
                // type: "email",
                message: 'Please input your email!'
              }
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
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Please input your first name!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Please input your last name!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit">
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </>
  );
}
export default SignUp;
