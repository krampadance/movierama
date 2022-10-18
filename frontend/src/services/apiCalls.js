import axios from 'axios'
const api_url = process.env.REACT_APP_API_URL


export const getMovies = async (skip, limit, order_by, direction="asc") => {
    if (order_by === 'none') {
        return axios.get(`${api_url}/movies/?skip=${skip}&limit=${limit}&direction=${direction}`)
    }
    if (order_by === 'created_at') { // Revert order direction when created_at is chosen because we render the period that the movie was created
        direction = direction === 'asc' ? 'desc' : 'asc'
    }
    return axios.get(`${api_url}/movies/?skip=${skip}&limit=${limit}&order_by=${order_by}&direction=${direction}`)
}

export const getUserData = async (token) => {
    return axios.get(`${api_url}/users/me/`, {'headers': {'Authorization': `Bearer ${token}`}})
}

export const addMovie = async (title, description, token) => {
    return axios.post(`${api_url}/movies/`, { title, description },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const addLike = async (movieId, token) => {
    return axios.post(`${api_url}/movies/${movieId}/vote/`, { likes: true },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const addHate = async (movieId, token) => {
    return axios.post(`${api_url}/movies/${movieId}/vote/`, { likes: false },{'headers': {'Authorization': `Bearer ${token}`}})
}

export const getUserMovies = async (userId, skip, limit, order_by, direction) => {
    if (order_by === 'none') {
        return axios.get(`${api_url}/users/${userId}/movies/?skip=${skip}&limit=${limit}&direction=${direction}`)
    }
    if (order_by === 'created_at') { // Revert order direction when created_at is chosen because we render the period that the movie was created
        direction = direction === 'asc' ? 'desc' : 'asc'
    }
    return axios.get(`${api_url}/users/${userId}/movies/?skip=${skip}&limit=${limit}&order_by=${order_by}&direction=${direction}`)
}

export const signup = async (email, password, firstName, lastName) => {
    return axios.post(`${api_url}/auth/signup/`, {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
}

export const login = async (email, password) => {
    return axios.post(`${api_url}/auth/login/`, {
        username: email,
        password: password
      }, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
}

