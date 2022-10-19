import {
  CLEAR_MOVIE_VOTES,
  SET_MOVIE_VOTES,
  ADD_LIKE,
  ADD_HATE,
  REMOVE_LIKE,
  REMOVE_HATE
} from '../actionTypes';

const initialState = {
  movies: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_MOVIE_VOTES: {
      return initialState;
    }
    case SET_MOVIE_VOTES: {
      return { ...state, movies: action.payload };
    }
    case ADD_LIKE: {
      const value = state.movies[action.payload].likesCount;
      return {
        ...state,
        movies: {
          ...state.movies,
          [action.payload]: {
            ...state.movies[action.payload],
            likesCount: value + 1
          }
        }
      };
    }
    case ADD_HATE: {
      const value = state.movies[action.payload].hatesCount;
      return {
        ...state,
        movies: {
          ...state.movies,
          [action.payload]: {
            ...state.movies[action.payload],
            hatesCount: value + 1
          }
        }
      };
    }
    case REMOVE_HATE: {
      const value = state.movies[action.payload].hatesCount;
      if (value === 0) {
        return state;
      }
      return {
        ...state,
        movies: {
          ...state.movies,
          [action.payload]: {
            ...state.movies[action.payload],
            hatesCount: value - 1
          }
        }
      };
    }
    case REMOVE_LIKE: {
      const value = state.movies[action.payload].likesCount;
      if (value === 0) {
        return state;
      }
      return {
        ...state,
        movies: {
          ...state.movies,
          [action.payload]: {
            ...state.movies[action.payload],
            likesCount: value - 1
          }
        }
      };
    }
    default:
      return state;
  }
}
