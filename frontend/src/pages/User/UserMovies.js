import { useParams } from 'react-router-dom';
import React from 'react';
import Dashboard from '../../components/Dashboard';

function UserMovies() {
  return <Dashboard selectedUser={ useParams().id }></Dashboard>;
}

export default UserMovies;