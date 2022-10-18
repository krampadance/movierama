import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate('/signup');
      }}
    >
      Sign Up
    </Button>
  );
}

export default SignUpButton;
