import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div className='wrapper'>
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        </Routes> 
      </BrowserRouter>
    </div>
  );
}

export default App;