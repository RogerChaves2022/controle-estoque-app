import axios from 'axios';

const instance  = axios.create({
  baseURL: 'http://localhost/controle-estoque-app/v1/api', // URL base da sua API
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
});

export default instance;