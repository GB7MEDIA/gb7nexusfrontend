import { axiosInstanceWithAuthAndFormData } from "./index";

export const uploadOneFile = async (formData) => {
    try {
        const response = axiosInstanceWithAuthAndFormData.post(`/upload/one`, formData);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const uploadMultipleFiles = async (formData) => {
    try {
        const response = axiosInstanceWithAuthAndFormData.post(`/upload/multiple`, formData);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}