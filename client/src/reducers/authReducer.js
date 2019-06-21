import { test_dispatch } from '../actions/types'

const initialState = {
  isAuthenticated: false,
  user: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case test_dispatch:
      return {
        ...state,
        user: action.payload
      }

    default:
      return state;
  }
}