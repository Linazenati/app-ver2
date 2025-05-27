import api from "./api"; // ton instance Axios

const API_POINT = "/assurances";

const assuranceService = {};

assuranceService.getAll = (token) =>
  api.get(API_POINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

assuranceService.getById = (id, token) =>
  api.get(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

assuranceService.create = (data, token) =>
  api.post(API_POINT, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

assuranceService.update = (id, data, token) =>
  api.put(`${API_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

assuranceService.remove = (id, token) =>
  api.delete(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default assuranceService;
