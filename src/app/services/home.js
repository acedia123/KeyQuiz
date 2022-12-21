import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const getCourseLearning = (data) => {
    var url = API_PATH + '/get-top-learning-course';
    return axios.post(url, data);
};

export const getTopCourseByUser = (data) => {
    var url = API_PATH + '/get-course-by-userid';
    return axios.post(url, data);
};

export const getTopPopularCourse = (data) => {
    var url = API_PATH + '/get-top-9-popular-course';
    return axios.post(url, data);
};
