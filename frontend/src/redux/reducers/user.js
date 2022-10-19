import {
  SET_USER_ID,
  SET_USERNAME,
  SET_USER_HATES,
  SET_USER_LIKES,
  CLEAR_USER,
  SET_ACCESS_TOKEN
} from '../actionTypes';

const initialState = {
  userId: undefined,
  userName: undefined,
  userLikes: [],
  userHates: [],
  accessToken: undefined
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
    case CLEAR_USER: {
      return initialState;
    }
    default:
      return state;
  }
}
