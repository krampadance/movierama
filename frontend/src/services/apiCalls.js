import axios from 'axios';

const api_url = "http://localhost:8000"


export const getMovies = (skip, limit) => {
    return axios.get(`${api_url}movies/?skip=${skip}&limit=${limit}`)
}

export const signup = (email, password, firstName, lastName) => {
    return axios.post(`${api_url}/auth/signup/`, {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
}


