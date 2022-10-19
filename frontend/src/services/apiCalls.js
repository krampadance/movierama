import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const getMovies = async (skip, limit, orderBy, direction = 'asc') => {
  if (orderBy === 'none') {
    return axios.get(`${apiUrl}/movies/?skip=${skip}&limit=${limit}&direction=${direction}`);
  }
  if (orderBy === 'created_at') {
    // Revert order direction when created_at is chosen because we
    // render the period that the movie was created
    direction = direction === 'asc' ? 'desc' : 'asc';
  }
  return axios.get(
    `${apiUrl}/movies/?skip=${skip}&limit=${limit}&order_by=${orderBy}&direction=${direction}`
  );
};

export const getUserData = async (token) =>
  axios.get(`${apiUrl}/users/me/`, {
  headers: { Authorization: `Bearer ${token}` }
});

export const addMovie = async (title, description, token) =>
  axios.post(
  `${apiUrl}/movies/`,
  { title, description },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const addMovieLike = async (movieId, token) =>
  axios.post(
  `${apiUrl}/movies/${movieId}/vote/`,
  { likes: true },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const addMovieHate = async (movieId, token) =>
  axios.post(
  `${apiUrl}/movies/${movieId}/vote/`,
  { likes: false },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const getUserMovies = async (userId, skip, limit, orderBy, direction) => {
  if (orderBy === 'none') {
    return axios.get(
      `${apiUrl}/users/${userId}/movies/?skip=${skip}&limit=${limit}&direction=${direction}`
    );
  }
  if (orderBy === 'created_at') {
    // Revert order direction when created_at is chosen because we render the period that the movie was created
    direction = direction === 'asc' ? 'desc' : 'asc';
  }
  return axios.get(
    `${apiUrl}/users/${userId}/movies/?skip=${skip}&limit=${limit}&order_by=${orderBy}&direction=${direction}`
  );
};

export const signup = async (email, password, firstName, lastName) =>
  axios.post(`${apiUrl}/auth/signup/`, {
  email,
  password,
  first_name: firstName,
  last_name: lastName
});

export const login = async (email, password) =>
  axios.post(
  `${apiUrl}/auth/login/`,
  {
    username: email,
    password
  },
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
);
