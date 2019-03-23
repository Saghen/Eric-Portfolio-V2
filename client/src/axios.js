import axios from 'axios';

const accessToken = localStorage.getItem('access_token');

export default axios.create({
  baseURL: 'https://saghen.com/',
  headers: {
    Authorization: accessToken
  }
});
