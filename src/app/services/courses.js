import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const getAllCourses = (data) => {
    var url = API_PATH + '/get-private-and-public-courses';
    return axios.post(url, data);
};

export const getCourseByCategory = (data) => {
    var url = API_PATH + '/get-course-by-category';
    return axios.post(url, data);
};

export const addCourse = (data) => {
    var url = API_PATH + '/add-course';
    return axios.post(url, data);
};

export const editCourse = (data) => {
    var url = API_PATH + '/edit-course';
    return axios.post(url, data);
};

export const deleteCourse = (data) => {
    var url = API_PATH + '/delete-course';
    return axios.post(url, data);
};

export const getCourseById = (data) => {
    var url = API_PATH + '/get-course-detail';
    return axios.post(url, data);
};

export const findCourseById = (data) => {
    var url = API_PATH + '/find-course-by-course-id';
    return axios.post(url, data);
};

export const addCourseToLearn = (data) => {
    var url = API_PATH + '/add-question-by-user';
    return axios.post(url, data);
};

export const getQuestionByCourse = (data) => {
    var url = API_PATH + '/search-question-by-type-of-question';
    return axios.post(url, data);
};

export const getQuestionDemo = (data) => {
    var url = API_PATH + '/get-trail-question-by-course';
    return axios.post(url, data);
};

export const getQuestionToLearn = (data) => {
    var url = API_PATH + '/get-question-to-learn';
    return axios.post(url, data);
};

export const getTotalQuestion = (data) => {
    var url = API_PATH + '/vinh-api';
    return axios.post(url, data);
};

export const learnAgain = (data) => {
    var url = API_PATH + '/learn-again';
    return axios.post(url, data);
};

export const toggleIsImportant = (data) => {
    var url = API_PATH + '/toggle-question-important';
    return axios.post(url, data);
};

export const getAllTerm = (data) => {
    var url = API_PATH + '/get-all-term';
    return axios.post(url, data);
};
export const changeTypeOfQuestion = (data) => {
    var url = API_PATH + '/change-type-of-question';
    return axios.post(url, data);
};
export const getCourseAdmin = (data) => {
    var url = API_PATH + '/get-all-course';
    return axios.post(url, data);
};

export const getListTestByUser = (data) => {
    var url = API_PATH + '/get-list-test';
    return axios.post(url, data);
};

export const createNote = (data) => {
    var url = API_PATH + '/create-note';
    return axios.post(url, data);
};
