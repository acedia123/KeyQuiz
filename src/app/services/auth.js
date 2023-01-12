import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const login = (data) => {
    var url = API_PATH + '/login';
    return axios.post(url, data);
};

export const register = (data) => {
    var url = API_PATH + '/register';
    return axios.post(url, data);
};

export const checkPasswordService = (data) => {
    var url = API_PATH + '/check-password';
    return axios.post(url, data);
};

export const loginWithGoogle = (data) => {
    var url = API_PATH + '/login-with-google';
    return axios.post(url, data);
};

export const changeStatus = (data) => {
    var url = API_PATH + '/toggle-account';
    return axios.post(url, data);
};
