import axiosService from "./axiosService";

const projectManagerService = {
    addProjectManager: (data) => axiosService.apis("POST", "/api/project_manager/add", data),
    updateProjectManager: (id, data) => axiosService.apis("PUT", `/api/project_manager/update/${id}`, data),
    deleteProjectManager: (id) => axiosService.apis("DELETE", `/api/project_manager/delete/${id}`),
    getProjectManager: (id) => axiosService.apis("GET", `/api/project_manager/${id}`),
    getAllProjectManager: (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return axiosService.apis("GET", `/api/project_manager_list?${queryString}`);
    }
};

export default projectManagerService;
