import { axiosInstanceWithoutAuth, axiosInstanceWithAuth } from "./index";

export const loginAPI = async (email, password) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/login`, {
            email, password
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const registerAPI = async (name, email, phonenumber, tenantId = "", password) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/register`, {
            name, email, phonenumber, tenantId, password
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const forgotPasswordAPI = async (email) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/password/forgot`, {
            email
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const newPasswordAPI = async (userId, newPasswordCode, newPassword) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/password/new`, {
            userId, newPasswordCode, newPassword
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const activateAccountAPI = async (userId, activationCode) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/activate`, {
            userId, activationCode
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const tfaAPI = async (userId, tfaCode) => {
    try {
        const response = await axiosInstanceWithoutAuth.post(`/auth/tfa`, {
            userId, tfaCode
        });
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const isLoggedInAPI = async () => {
    try {
        const response = await axiosInstanceWithAuth.post(`/auth/isLoggedIn`);
        return { success: true, data: { response } }
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}