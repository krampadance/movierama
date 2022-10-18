import {
  SET_USER_ID,
  SET_USERNAME,
  SET_USER_HATES,
  SET_USER_LIKES,
  CLEAR_STATE,
  SET_ACCESS_TOKEN,
  SET_MOVIES,
  ADD_LIKE,
  ADD_HATE,
  REMOVE_LIKE,
  REMOVE_HATE
} from '../actionTypes';

const initialState = {
  userId: undefined,
  userName: undefined,
  userLikes: [],
  userHates: [],
  accessToken: undefined,
  movies: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_ID: {
      return { ...state, userId: action.payload };
    }
    case SET_USERNAME: {
      return { ...state, userName: action.payload };
    }
    case SET_USER_LIKES: {
      return { ...state, userLikes: action.payload };
    }
    case SET_USER_HATES: {
      return { ...state, userHates: action.payload };
    }
    case SET_ACCESS_TOKEN: {
      return { ...state, accessToken: action.payload };
    }
    case CLEAR_STATE: {
      return initialState;
    }
    case SET_MOVIES: {
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
          },
        },
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
          },
        },
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
          },
        },
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
          },
        },
      };
    }
    default:
      return state;
  }
}
