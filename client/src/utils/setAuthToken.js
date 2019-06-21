import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    //apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  }
  else {
    //Delete auth header if no user
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthToken;