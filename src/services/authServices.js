import axiosService from "./axiosService";

const authServices = {
    signup: (userData) => axiosService.apis("POST", "/api/signup", userData),
    login: (credentials) => axiosService.apis("POST", "/api/login", credentials),
};

export default authServices;
