import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate('/login');
      }}>
      Login
    </Button>
  );
}

export default LoginButton;
