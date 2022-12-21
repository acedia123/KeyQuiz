import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const getAllCategories = () => {
    var url = API_PATH + '/get-all-category';
    return axios.get(url);
};

export const searchOrFilterCategories = (data) => {
    var url = API_PATH + '/search-or-filter-categories';
    return axios.post(url, data);
};

export const addCategory = (data) => {
    var url = API_PATH + '/add-category';
    return axios.post(url, data);
};

export const editCategory = (data) => {
    var url = API_PATH + '/edit-category';
    return axios.post(url, data);
};

export const getCategoryById = (data) => {
    var url = API_PATH + '/find-category-by-id';
    return axios.post(url, data);
};

export const deleteCategoryById = (data) => {
    var url = API_PATH + '/delete-category-by-id';
    return axios.post(url, data);
};
