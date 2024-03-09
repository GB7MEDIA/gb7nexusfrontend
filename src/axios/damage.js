import { axiosInstanceWithAuth } from "./index";

export const getAllDamagesAPI = async () => {
    try {
        const response = axiosInstanceWithAuth.get(`/damages/all`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const getAllDamagesByUserIdAPI = async (userId) => {
    try {
        const response = axiosInstanceWithAuth.get(`/damages/all/users/one/${userId}`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' }; 
    }
}

export const getDamageByIdAPI = async (damageId) => {
    try {
        const response = axiosInstanceWithAuth.get(`/damages/one/${damageId}`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const createDamageAPI = async (title, mediaUrl, objectId, adressId, floor, remarks) => {
    try {
        const response = axiosInstanceWithAuth.post(`/damages/one/create`, {
            title, mediaUrl, objectId, adressId, floor, remarks
        });
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const editDamageByIdAPI = async (damageId, title, remarks, damageStatus = "received") => {
    try {
        const response = axiosInstanceWithAuth.put(`/damages/one/${damageId}/edit`, {
            title, remarks, damageStatus
        });
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' }; 
    }
}

export const deleteDamageByIdAPI = async (damageId) => {
    try {
        const response = axiosInstanceWithAuth.delete(`/damages/one/${damageId}/delete`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}