import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddMovie from './pages/User/AddMovie';
import UserMovies from './pages/User/UserMovies';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users/:id" element={<UserMovies />} />
          <Route path="/users/addMovie" element={<AddMovie />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
