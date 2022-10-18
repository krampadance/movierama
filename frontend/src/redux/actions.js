import { SET_USER_ID, SET_USER_HATES, SET_USER_LIKES, SET_USERNAME, CLEAR_STATE, SET_ACCESS_TOKEN } from './actionTypes'

export const setUserId = userId => {
  return {
    type: SET_USER_ID,
    payload: userId,
  }
} 

export const setUserName = username => {
  return {
    type: SET_USERNAME,
    payload: username,
  }
}

export const setUserHates = hates => {
  return {
    type: SET_USER_HATES,
    payload: hates,
  }
}

export const setUserLikes = likes => {
  return {
    type: SET_USER_LIKES,
    payload: likes,
  }
}

export const setAccessToken = accessToken => {
  return {
    type: SET_ACCESS_TOKEN,
    payload: accessToken,
  }
}

export const clearState = () => {
  return {
    type: CLEAR_STATE,
    payload: {},
  }
}
