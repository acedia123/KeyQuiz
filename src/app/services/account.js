import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const searchOrFilterAccounts = (data) => {
    var url = API_PATH + '/search-accounts';
    return axios.post(url, data);
};

export const addAccount = (data) => {
    var url = API_PATH + '/add-account';
    return axios.post(url, data);
};

export const editAccount = (data) => {
    var url = API_PATH + '/edit-category';
    return axios.post(url, data);
};

export const editName = (data) => {
    var url = API_PATH + '/edit-username';
    return axios.post(url, data);
};

export const getAccountById = (data) => {
    var url = API_PATH + '/find-account-by-id';
    return axios.post(url, data);
};

export const toggleAccountById = (data) => {
    var url = API_PATH + '/toggle-account';
    return axios.post(url, data);
};

export const changeAvatar = (data) => {
    var url = API_PATH + '/change-avatar';
    return axios.post(url, data);
};

export const changePassword = (data) => {
    var url = API_PATH + '/change-password';
    return axios.post(url, data);
};
