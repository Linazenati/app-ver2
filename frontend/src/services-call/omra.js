import api from "./api";

const API_POINT = "/omra";

const omraService = {};

omraService.getAll = (token) =>
  api.get(`${API_POINT}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

omraService.getById = (id, token) =>
  api.get(`${API_POINT}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

omraService.createItem = (data, token) =>
  api.post(`${API_POINT}`, data, {
headers: {  Authorization: `Bearer ${token}`  ,
      "Content-Type": "multipart/form-data",  },  });

omraService.updateItem = (id, data, token) =>
  api.put(`${API_POINT}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

omraService.deleteItem = (id, token) =>
  api.delete(`${API_POINT}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default omraService;
