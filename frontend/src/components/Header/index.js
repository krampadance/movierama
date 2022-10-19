import { Button, Row, Col } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from '../../components/LoginButton';
import SignUpButton from '../../components/SignUpButton';

function Header({ user, clearState, initData }) {
  return (
    <>
      <Row className="header">
        <Col span={8}>
          <Link className="logo" to={'/'}>
            Movierama
          </Link>
        </Col>
        {user.accessToken === undefined && (
          <Col span={8} offset={7}>
            <LoginButton />
            <SignUpButton />
          </Col>
        )}
        {user.accessToken !== undefined && (
          <Col span={8} offset={7}>
            <div>
              Welcome <Link to={`users/${user.userId}`}>{user.userName}</Link> |
              <Button
                onClick={() => {
                  clearState();
                  initData();
                }}>
                Logout
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}

export default Header;
