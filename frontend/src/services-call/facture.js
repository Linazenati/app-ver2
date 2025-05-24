import api from "./api";

const API_POINT = "/factures";

export default {
  async getMesFactures(token) {
    console.log("[FactureService] Tentative de récupération des factures...");
    try {
      const response = await api.get(`${API_POINT}/mes-factures`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Modification clé ici: utilisez response directement si response.data est undefined
      const responseData = response.data || response;
      
      console.log("[FactureService] Réponse du backend:", responseData);
      
      // Transforme les données pour avoir un format cohérent
      const formattedData = Array.isArray(responseData) 
        ? responseData.map(facture => ({
            id: facture.id || facture.filename?.replace('.pdf', ''),
            filename: facture.filename,
            numero: facture.numero || extractNumber(facture.filename),
            date: facture.date || new Date().toISOString()
          }))
        : [];

      console.log("[FactureService] Données formatées:", formattedData);
      return formattedData;

    } catch (error) {
      console.error("[FactureService] Erreur:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  async downloadFacture(filename, token) {
    try {
      const response = await api.get(`${API_POINT}/download/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      return response.data;
    } catch (error) {
      console.error("[FactureService] Erreur lors du téléchargement:", error);
      throw error;
    }
  }
};

// Helper pour extraire le numéro du nom de fichier
function extractNumber(filename) {
  const match = filename?.match(/(\d+)\.pdf$/);
  return match ? match[1] : '0001';
}