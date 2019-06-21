import { test_dispatch } from './types'

//Register user

export const registerUser = (userData) => {
  return {
    type: test_dispatch,
    payload: userData
  }
}
