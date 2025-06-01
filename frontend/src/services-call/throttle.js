import api from './api'; // axios configuré

const API_POINT = '/quota';

const throttleService = {};
 

// 🔍 Récupérer une Omra par ID
throttleService.afficherQuota = () => api.get(`${API_POINT}/quota-publication`);



// Route GET pour récupérer l'état du quota récupération
throttleService.getQuota = () => api.get(`${API_POINT}/quota`);



// 
throttleService.recuperer = () => api.post(`${API_POINT}/recuperer`);



// Routes pour la suppression
throttleService.getEtatQuotaSupp= () => api.get(`${API_POINT}/supp/etat`);

throttleService.incrementerQuotaSupp= () => api.post(`${API_POINT}/supp/incrementer`);



export default throttleService;
