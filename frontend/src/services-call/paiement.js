import api from "./api";

const API_POINT = "/paiements";

const paiementService = {};

// 🔐 Récupérer tous les paiements (admin backoffice)
paiementService.getAll = (token) =>
  api.get(`${API_POINT}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default paiementService;
