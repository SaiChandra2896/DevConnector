import axios from "axios";
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

//Register user

export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/user/register', userData).then(res => history.push('/login'))
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
}

//login- get user token
export const loginUser = (userData) => (dispatch) => {
  axios.post('/api/user/login', userData).then(res => {
    //save to local storage
    const { token } = res.data;

    localStorage.setItem('jwtToken', token);
    //set token to auth header
    setAuthToken(token);
    //decode token to get user data
    const decoded = jwt_decode(token);
    //set current user
    dispatch(setCurrentUser(decoded));
  }).catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  })
}

//set logged in user

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}
