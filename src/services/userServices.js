import axiosService from "./axiosService";

const userServices = {
    getProfile: () => axiosService.apis("GET", "/api/get-profile"),
    updateProfile: () => axiosService.apis("PUT", "/api/update-profile"),
};

export default userServices;