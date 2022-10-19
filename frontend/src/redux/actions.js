import {
  SET_USER_ID,
  SET_USER_HATES,
  SET_USER_LIKES,
  SET_USERNAME,
  CLEAR_USER,
  SET_ACCESS_TOKEN,
  CLEAR_MOVIE_VOTES,
  SET_MOVIE_VOTES,
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

export const clearUser = () => ({
  type: CLEAR_USER,
  payload: {}
});

export const clearMovieVotes = () => ({
  type: CLEAR_MOVIE_VOTES,
  payload: {}
});

export const setMovieVotes = (votes) => ({
  type: SET_MOVIE_VOTES,
  payload: votes
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
