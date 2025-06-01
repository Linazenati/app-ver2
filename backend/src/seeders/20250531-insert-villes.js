const { Ville } = require('../models'); // adapte selon ton chemin réel vers models/index.js ou models/ville.js

const VILLES_IDS = {
  "Alger": "-458371",
  "Béjaia": "-460532",
  "Oran": "-480007",
  "Annaba": "-458855",
  "Sétif": "-484254",
  "Canstantine": "-464717",
  "jijel": "-472986",
  "Skikda": "-486422",
  "Tlemcen": "-490290",
  "Mostaganem":"-478790",
  "Tunis" : "-731701",
  "Hammamet": "-722356",
  "Sousse": "-731250",
  "Monastir": "-728914",
  "Mahdia": "-722531",
  "Tozeur": "-731519",
  "Paris": "-1456928",
  "Marseille": "-1449947",
  "montréal":"-569541",
  "Istanbul":"-755070",
  "London": "-2601889",
  "Barcelona": "-372490",
  "Valence": "-1474436",
  "Venise": "-132007",
  "Dubai":"-782831",
  "Makka": "-3096949",
  "Medina": "-3092186",
}

const VILLES_REGIONS = {
  "Alger": "Algérie",
  "Béjaia": "Algérie",
  "Oran": "Algérie",
  "Annaba": "Algérie",
  "Sétif": "Algérie",
  "Canstantine": "Algérie",
  "jijel": "Algérie",
  "Skikda": "Algérie",
  "Tlemcen": "Algérie",
  "Mostaganem": "Algérie",
  "Tunis": "Tunisie",
  "Hammamet": "Tunisie",
  "Sousse": "Tunisie",
  "Monastir": "Tunisie",
  "Mahdia": "Tunisie",
  "Tozeur": "Tunisie",
  "Paris": "Monde",
  "Marseille": "Monde",
  "montréal": "Monde",
  "Istanbul": "Monde",
  "London": "Monde",
  "Barcelona": "Monde",
  "Valence": "Monde",
  "Venise": "Monde",
  "Dubai": "Monde",
  "Makka": "Monde",
  "Medina": "Monde",
}

async function insertVilles() {
  try {
    const villesToInsert = Object.keys(VILLES_IDS).map(nom => ({
      nom,
      region: VILLES_REGIONS[nom] || "Inconnu",
      dest_id: VILLES_IDS[nom]
    }));

    // Optionnel : supprime les entrées existantes pour éviter les doublons
await Ville.destroy({ where: {} }); // sécurisé sans TRUNCATE

    // Insert bulk
    await Ville.bulkCreate(villesToInsert);

    console.log("Insertion des villes terminée avec succès !");
    process.exit(0); // quitte le script
  } catch (error) {
    console.error("Erreur lors de l'insertion des villes :", error);
    process.exit(1);
  }
}

insertVilles();
