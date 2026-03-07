import axiosService from "./axiosService";

const rehabGroupService = {
  getAll: () => axiosService.apis("GET", "/api/rehab-groups"),
  getById: (id) => axiosService.apis("GET", `/api/rehab-groups/${id}`),
  create: (data) => axiosService.apis("POST", "/api/rehab-groups", data),
  update: (id, data) => axiosService.apis("PUT", `/api/rehab-groups/${id}`, data),
  delete: (id) => axiosService.apis("DELETE", `/api/rehab-groups/${id}`),
};

export default rehabGroupService;
