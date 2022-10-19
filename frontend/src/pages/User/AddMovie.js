import { Button, Form, Input, Row, Col } from 'antd';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addMovie } from '../../services/apiCalls';
import { showSuccess, showError } from '../../utils';

function AddMovie({ accessToken }) {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await addMovie(values.title, values.description, accessToken);
      showSuccess('Movie added', `Movie ${values.title} created successfully`);
      navigate('/');
    } catch (e) {
      showError('Could not add movie', e.response.data.detail);
    }
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
        <Col span={8} offset={4}>
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
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please enter a movie title'
                }
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please enter a movie description'
                }
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}>
              <Button type="primary" htmlType="submit">
                Add Movie
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  accessToken: state.user.accessToken
});

export default connect(mapStateToProps)(AddMovie);
