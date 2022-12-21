import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const getRateCourseByUser = (data) => {
    var url = API_PATH + '/get-rate-course-by-user';
    return axios.post(url, data);
};

export const filterCourseByRateNum = (data) => {
    var url = API_PATH + '/filter-rate-by-rate-number';
    return axios.post(url, data);
};

export const addRate = (data) => {
    var url = API_PATH + '/add-comment';
    return axios.post(url, data);
};
export const deleteComment = (data) => {
    var url = API_PATH + '/delete-commnent';
    return axios.post(url, data);
};
