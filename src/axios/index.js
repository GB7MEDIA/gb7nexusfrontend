import axios from 'axios';
import { baseBackendUrl } from '../config/index';

export const axiosInstanceWithoutAuth = axios.create({
    baseURL: baseBackendUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const axiosInstanceWithAuth = axios.create({
    baseURL: baseBackendUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export const axiosInstanceWithAuthAndFormData = axios.create({
    baseURL: baseBackendUrl,
    headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});
