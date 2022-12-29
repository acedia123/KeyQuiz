import axios from 'axios';
import { API_ENDPOINT } from '../appConfig';
import { API_KEY, CONTEXT_KEY } from '../constants/constants';

const API_PATH = API_ENDPOINT + 'api';

export const searchingGeneral = (data) => {
    var url = API_PATH + '/searching-general';
    return axios.post(url, data);
};

export const searchingGoogle = (data) => {
    var url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CONTEXT_KEY}&q=${data}`;
    return axios.get(url);
};

export const downloadTemplate = () => API_PATH + '/download-template';
