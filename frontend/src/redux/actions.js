import {
  SET_USER_ID,
  SET_USER_HATES,
  SET_USER_LIKES,
  SET_USERNAME,
  CLEAR_STATE,
  SET_ACCESS_TOKEN,
  SET_MOVIES,
  ADD_LIKE,
  ADD_HATE,
  REMOVE_HATE,
  REMOVE_LIKE
} from './actionTypes';

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId
});

export const setUserName = (username) => ({
  type: SET_USERNAME,
  payload: username
});

export const setUserHates = (hates) => ({
  type: SET_USER_HATES,
  payload: hates
});

export const setUserLikes = (likes) => ({
  type: SET_USER_LIKES,
  payload: likes
});

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  payload: accessToken
});

export const clearState = () => ({
  type: CLEAR_STATE,
  payload: {}
});

export const setMovies = (movies) => ({
  type: SET_MOVIES,
  payload: movies
});

export const addLike = (movieId) => ({
  type: ADD_LIKE,
  payload: movieId
});

export const removeLike = (movieId) => ({
  type: REMOVE_LIKE,
  payload: movieId
});

export const addHate = (movieId) => ({
  type: ADD_HATE,
  payload: movieId
});

export const removeHate = (movieId) => ({
  type: REMOVE_HATE,
  payload: movieId
});
