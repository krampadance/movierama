import axios from 'axios';

const api_url = "http://localhost:8000"


export const getMovies = (skip, limit, order_by="none", direction="asc") => {
    return axios.get(`${api_url}/movies/?skip=${skip}&limit=${limit}&order_by=${order_by}&direction=${direction}`)
}

export const getUserData = (token) => {
    return axios.get(`${api_url}/users/me/`, {'headers': {'Authorization': `Bearer ${token}`}})
}

export const addMovie = (title, description, token) => {
    return axios.post(`${api_url}/movies/`, { title, description },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const addLike = (movieId, token) => {
    return axios.post(`${api_url}/movies/${movieId}/vote/`, { likes: true },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const addHate = (movieId, token) => {
    return axios.post(`${api_url}/movies/${movieId}/vote/`, { likes: false },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const getUserMovies = (userId, skip, limit, order_by, direction) => {
    return axios.get(`${api_url}/users/${userId}/movies/?skip=${skip}&limit=${limit}&order_by=${order_by}&direction=${direction}`)
}

export const signup = (email, password, firstName, lastName) => {
    return axios.post(`${api_url}/auth/signup/`, {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
}

export const login = (email, password) => {
    return axios.post(`${api_url}/auth/login/`, {
        username: email,
        password: password
      }, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
}

