import axiosService from "./axiosService";

const userServices = {
    getProfile: () => axiosService.apis("GET", "/api/get-profile"),
    updateProfile: (data) => axiosService.apis("PUT", "/api/update-profile", data),
    changePassword: (data) => axiosService.apis("POST", "/api/change-password", data),
    resetPassword: (data) => axiosService.apis("POST", "/api/reset-password", data),
};

export default userServices;