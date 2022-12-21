import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';

const API_PATH = API_ENDPOINT + 'api';

export const importCourseExcel = (formData) => {
    var url = API_PATH + '/import-excel';
    return axios({
        method: 'post',
        url: url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
