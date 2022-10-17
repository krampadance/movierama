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
        state.userId = action.payload;
        return state;
    }
    case SET_USERNAME: {
        state.userName = action.payload;
        return state;
    }
    case SET_USER_LIKES: {
        state.userLikes = action.payload;
        return state;
    }
    case SET_USER_HATES: {
        state.userHates = action.payload;
        return state;
    }
    case CLEAR_STATE: {
        state ={};
        return state;
    }
    default:
      return state;
  }
}
