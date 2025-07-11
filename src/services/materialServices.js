import axiosService from "./axiosService";

const materialService = {
    //room
    addMaterialRoom: (data) => axiosService.apis("POST", "/api/material-room/add", data),
    // getMaterialRoom: () => axiosService.apis("GET", `/api/material-room`),
    getMaterialRoom: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/material-room?${queryString}`);
    },
    updateMaterialRoom: (id, data) => axiosService.apis("PUT", `/api/materials-room/update/${id}`, data),
    deleteMaterialRoom: (id) => axiosService.apis("DELETE", `/api/materials-room/delete/${id}`),

    //material
    addMaterial: (data) => axiosService.apis("POST", "/api/materials/add", data),  // Use correct endpoint
    getMaterial: (queryParams) => axiosService.apis("GET", "/api/materials", { queryParams }),  // Use correct endpoint
    updateMaterial: (id, data) => axiosService.apis("PUT", `/api/materials/update/${id}`, data),
    deleteMaterial: (id) => axiosService.apis("DELETE", `/api/materials/delete/${id}`),

    //sub-material
    addSubMaterial: (data) => axiosService.apis("POST", "/api/sub-materials/add", data),  // Use correct endpoint
    getSubMaterial: (queryParams) => axiosService.apis("GET", "/api/sub-materials", { queryParams }),  // Use correct endpoint
    updateSubMaterial: (id, data) => axiosService.apis("PUT", `/api/sub-materials/update/${id}`, data),
    deleteSubMaterial: (id) => axiosService.apis("DELETE", `/api/sub-materials/delete/${id}`),

    //project
    addProject: (data) => axiosService.apis("POST", "/api/projects/create", data),
    getProjects: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/projects?${queryString}`);
    },
    getProjectById: (id) => axiosService.apis("GET", `/api/projects/${id}`),
    updateProject: (id, data) => axiosService.apis("PUT", `/api/projects/${id}`, data),
    deleteProject: (id) => axiosService.apis("DELETE", `/api/projects/${id}`)
};

export default materialService;
