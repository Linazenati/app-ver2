const { Vol } = require('../models'); // adapte le chemin selon ta structure

/**
 * Enregistre un vol dans la base s'il n'existe pas déjà.
 * @param {Object} volData - Les données du vol à enregistrer.
 * @returns {Promise<Vol>} Le vol créé ou existant.
 */
async function creerOuTrouverVol(volData) {
  // Essayer de trouver un vol avec ce numero_vol
  let vol = await Vol.findOne({ where: { numero_vol: volData.numero_vol } });
  if (vol) {
    return vol; // vol déjà en base
  }
  // Sinon créer un nouveau vol
  vol = await Vol.create(volData);
  return vol;
}

/**
 * Enregistre plusieurs vols en base, en évitant les doublons selon numero_vol.
 * @param {Array<Object>} volsData - Liste des vols à enregistrer.
 * @returns {Promise<Array<Vol>>} La liste des vols créés ou existants.
 */
async function creerPlusieursVols(vols) {
  try {
    // Filtrer les vols invalides
    // Préparer tous les vols (même incomplets), avec valeurs par défaut
    const volsPrepares = vols.map(vol => ({
      numero_vol: vol.numero_vol || `GEN-${Math.random().toString(36).substr(2, 8)}`,
      compagnie_aerienne: vol.compagnie_aerienne || 'INCONNU',
      aeroport_depart: vol.aeroport_depart || 'INCONNU',
      aeroport_arrivee: vol.aeroport_arrivee || 'INCONNU',
      date_depart: vol.date_depart || new Date(),
      date_arrivee: vol.date_arrivee || new Date(),
      duree: vol.duree || 'PT0H0M',
      prix: typeof vol.prix === 'number' ? vol.prix : 0,
      devise: vol.devise || 'EUR',
      bagages_inclus: typeof vol.bagages_inclus === 'boolean' ? vol.bagages_inclus : false,
      remboursable: typeof vol.remboursable === 'boolean' ? vol.remboursable : false,
      flightOfferId: vol.flightOfferId || null,
      lastTicketingDate: vol.lastTicketingDate || null,
      source: vol.source || 'AMADEUS'
    }));


    console.log(`Vols valides à sauvegarder: ${volsPrepares.length}/${vols.length}`);

    // Option 1: Création en masse avec bulkCreate
    const result = await Vol.bulkCreate(volsPrepares, {
      updateOnDuplicate: ['date_depart', 'date_arrivee', 'prix'],
      validate: true
    });


    return {
      success: true,
      created: result.length,
    };

  } catch (error) {
    console.error('Erreur dans creerPlusieursVols:', error);
    throw error;
  }
}

async function getById(id) {
  return await Vol.findByPk(id); // ou findOne({ where: { id } }) selon vos préférences
}

/**
 * Récupère un vol par son numéro.
 * @param {string} numeroVol - Le numéro du vol à chercher.
 * @returns {Promise<Vol|null>} Le vol trouvé ou null.
 */
async function getByNumeroVol(numeroVol) {
  return await Vol.findOne({ where: { numero_vol: numeroVol } });
} 
module.exports = {
  creerOuTrouverVol,
  creerPlusieursVols,
  getById,
  getByNumeroVol
};
