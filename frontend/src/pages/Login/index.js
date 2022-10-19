import { Button, Form, Input, Col, Row } from 'antd';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../services/apiCalls';
import { showError } from '../../utils';
import { setAccessToken } from '../../redux/actions';

function Login({ setAccessToken }) {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    let res;
    try {
      res = await login(values.username, values.password);
      setAccessToken(res.data.access_token);
      navigate('/');
    } catch (e) {
      showError('Login Error', e.response.data.detail);
    }
    await login(values.username, values.password);
  };

  return (
    <>
      <Row type="flex" justify="center" align="middle">
        <Col span={12} offset={6}>
          <Link className="logo" to="/">
            Movierama
          </Link>
        </Col>
      </Row>
      <Row type="flex" justify="start" align="middle">
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
            autoComplete="off">
            <Form.Item
              label="Email"
              name="username"
              rules={[
                {
                  required: true,
                  // type: "email",
                  message: 'Please input your email!'
                }
              ]}>
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
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default connect(null, { setAccessToken })(Login);
