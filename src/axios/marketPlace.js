import { axiosInstanceWithAuth } from "./index";

export const getAllProductsAPI = async () => {
    try {
        const response = axiosInstanceWithAuth.get(`/products/all`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const getProductByIdAPI = async (productId) => {
    try {
        const response = axiosInstanceWithAuth.get(`/products/one/${productId}`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const createProductAPI = async (title, mediaUrls = "", description) => {
    try {
        const response = axiosInstanceWithAuth.post(`/products/one/create`, {
            title, mediaUrls, description
        });
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const editProductByIdAPI = async (productId, title, description) => {
    try {
        const response = axiosInstanceWithAuth.put(`/products/one/${productId}/edit`, {
            title, description
        });
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}

export const deleteProductByIdAPI = async (productId) => {
    try {
        const response = axiosInstanceWithAuth.put(`/products/one/${productId}/delete`);
        return response;
    } catch (error) {
        return { success: false, error: error.response ? error.response.data : 'An unexpected error occurred' };
    }
}