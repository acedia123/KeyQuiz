import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const dashboardCourse = (data) => {
    var url = API_PATH + '/get-dashboard-course';
    return axios.post(url, data);
};

export const dashboardAccount = (data) => {
    var url = API_PATH + '/get-dashboard-user';
    return axios.post(url, data);
};
