import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const reportCourse = (data) => {
    var url = API_PATH + '/report-course';
    return axios.post(url, data);
};

export const reportQuestion = (data) => {
    var url = API_PATH + '/report-question';
    return axios.post(url, data);
};

export const reportRate = (data) => {
    var url = API_PATH + '/report-rate';
    return axios.post(url, data);
};

export const getListCourseReport = (data) => {
    var url = API_PATH + '/get-list-report-course';
    return axios.post(url, data);
};

export const getListQuestionReport = (data) => {
    var url = API_PATH + '/get-list-report-question';
    return axios.post(url, data);
};

export const getListRateReport = (data) => {
    var url = API_PATH + '/get-list-report-rate';
    return axios.post(url, data);
};
