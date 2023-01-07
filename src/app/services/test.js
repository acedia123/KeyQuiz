import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const createTest = (data) => {
    var url = API_PATH + '/create-test';
    return axios.post(url, data);
};
export const testResultApi = (data) => {
    var url = API_PATH + '/test-result';
    return axios.post(url, data);
};
