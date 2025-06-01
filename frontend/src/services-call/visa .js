import api from "./api"; // Assure-toi que ce fichier configure bien axios

const API_POINT = "/visa";



// envoyer / creer un voyage
const visaService = {};
visaService.createVisa = (formData,token) => {
  return api.post(API_POINT, formData, {
    headers: { "Content-Type": "multipart/form-data" ,   Authorization: `Bearer ${token}`},
  });
};



visaService.getAllVisas = (params) => api.get(API_POINT,  params );


 visaService.getParticipantsByVisaId = (visaId) => api.get(`${API_POINT}/visas/${visaId}/participants`);

 visaService.getJustificatifsByParticipantId = (participantId) => api.get(`${API_POINT}/participants/${participantId}/justificatifs`);

export default visaService;