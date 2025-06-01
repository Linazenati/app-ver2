import api from "./api"; // instance Axios déjà configurée

const API_POINT = "/config-apis";

const apiConfigService = {};

apiConfigService.getAll = (token) =>
  api.get(API_POINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

apiConfigService.getById = (id, token) =>
  api.get(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

apiConfigService.create = (data, token) =>
  api.post(API_POINT, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

apiConfigService.update = (id, data, token) =>
  api.put(`${API_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

apiConfigService.remove = (id, token) =>
  api.delete(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

apiConfigService.updateStatus = (id, active, token) =>
  api.put(`${API_POINT}/${id}/status`, { active }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

apiConfigService.testConnection = (id, token) =>
  api.post(`${API_POINT}/${id}/test`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default apiConfigService;
