import api from "./api";

const API_PIONT = "/utilisateurs";

const serviceCall = {}

serviceCall.getAll = (params) => api.get(`${API_PIONT}`, { params });

serviceCall.getById = (id) => api.get(`${API_PIONT}/${id}`);

serviceCall.createAgent = (data) => api.post(`${API_PIONT}/Agent`, data);


serviceCall.updateItem = (id, data) => api.put(`${API_PIONT}/${id}`, data);

serviceCall.deleteItem = (id) => api.delete(`${API_PIONT}/${id}`);

export default serviceCall; 