import axiosService from "./axiosService";

const authServices = {
    signup: (userData) => axiosService.apis("POST", "/api/signup", userData),
    login: (credentials) => axiosService.apis("POST", "/api/login", credentials),
    addAdmin: (data) => axiosService.apis("POST", "/api/admin/add", data),
    forgotPassword: (data) => axiosService.apis("POST", "/api/forgot-password", data),
    resetPassword: (data) => axiosService.apis("POST", "/api/reset-password", data),
    changePassword: (data) => axiosService.apis("POST", "/api/change-password", data),
    getPublicManagers: () => axiosService.apis("GET", "/api/public-managers"),
    getAllClients: (params) => axiosService.apis("GET", "/api/get-all-clients", params),
};

export default authServices;
