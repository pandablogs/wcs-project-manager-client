import axiosService from "./axiosService";

const materialService = {
    //room
    addMaterialRoom: (data) => axiosService.apis("POST", "/api/material-room/add", data),
    getMaterialRoomAll: () => axiosService.apis("GET", `/api/material-room/all`),
    getMaterialRoomById: (id) => axiosService.apis("GET", `/api/material-room/${id}`),
    getMaterialRoom: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/material-room?${queryString}`);
    },
    updateMaterialRoom: (id, data) => axiosService.apis("PUT", `/api/materials-room/update/${id}`, data),
    deleteMaterialRoom: (id) => axiosService.apis("DELETE", `/api/materials-room/delete/${id}`),

    //material
    addMaterial: (data) => axiosService.apis("POST", "/api/materials/add", data),  // Use correct endpoint
    getMaterialAll: (queryParams) => axiosService.apis("GET", "/api/materials/all", { queryParams }),
    getMaterial: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/materials?${queryString}`);
    },
    updateMaterial: (id, data) => axiosService.apis("PUT", `/api/materials/update/${id}`, data),
    deleteMaterial: (id) => axiosService.apis("DELETE", `/api/materials/delete/${id}`),

    //sub-material
    addSubMaterial: (data) => axiosService.apis("POST", "/api/sub-materials/add", data),  // Use correct endpoint
    getSubMaterialAll: (queryParams) => axiosService.apis("GET", "/api/sub-materials/all", { queryParams }),
    getSubMaterial: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/sub-materials?${queryString}`);
    },
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
