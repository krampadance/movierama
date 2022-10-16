import { Button } from 'antd';
import React from 'react';
import useToken from '../../services/useToken';


const LoginButton = () => {
    const { token, setToken, getToken } = useToken();
    return (
    
        <Button
            onClick={() => {
                setToken(0)
                console.log(getToken())
            }}
        >Login</Button>
  );
}

export default LoginButton;