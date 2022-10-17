import { SET_USER_ID, SET_USERNAME, SET_USER_HATES, SET_USER_LIKES, CLEAR_STATE } from "../actionTypes";

const initialState = {
  userId: null,
  userName: null,
  userLikes: [],
  userHates: []
};

export default function(state = initialState, action) {
    switch (action.type) {
    case SET_USER_ID: {
        return {...state, userId: action.payload};
    }
    case SET_USERNAME: {
        return {...state, userName: action.payload};
    }
    case SET_USER_LIKES: {
        return {...state, userLikes: action.payload};
    }
    case SET_USER_HATES: {
        return {...state, userHates: action.payload};
    }
    case CLEAR_STATE: {
        return initialState;
    }
    default:
      return state;
  }
}
