import axiosService from "./axiosService";

const authServices = {
    signup: (userData) => axiosService.apis("POST", "/api/signup", userData),
    login: (credentials) => axiosService.apis("POST", "/api/login", credentials),
    changePassword: (data) => axiosService.apis("POST", "/api/change-password", data),
    forgotPassword: (data) => axiosService.apis("POST", "/api/forgot-password", data),
    resetPassword: (data) => axiosService.apis("POST", "/api/reset-password", data),
};

export default authServices;
