const { Hotel } = require('../models'); // adapte le chemin selon ta structure
const { Ville } = require('../models');
const axios = require("axios");
const { Op , Sequelize } = require("sequelize");

const service = {};

const URL_BOOKING_COM = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels";
const OPTIONAL_PARAMS = "&page_number=1&units=metric&temperature_unit=c&languagecode=fr&currency_code=EUR&location=US";

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '6761c199f8msh08da520f135ee89p129be6jsn149a961b3909',
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
  }
};

const EUR_TO_DZD = 149.74;

// Récupérer toutes les villes pour le menu
service.getallVilles = async (region) => {
  const whereClause = region ? { region } : {};
  return await Ville.findAll({ where: whereClause, order: [['nom', 'ASC']] });
};

// Récupérer les hôtels par ville quand on clique sur une ville
service.findHotelsByVilleId = async (villeId) => {
  return await Hotel.findAll({
    where: { villeId: villeId }
  });
};

// Recherche et sauvegarde des hôtels pour une ville spécifique
service.searchAndSaveHotelsForVille = async function (
  villeNom,
  arrival_date,
  departure_date,
  nbr_chambre,
  nbr_adulte,
  age_enfants
) {
  const ville = await Ville.findOne({ where: { nom: villeNom } });
  if (!ville || !ville.dest_id) throw new Error(`Ville non trouvée ou dest_id manquant : ${villeNom}`);

  // Normalisation des âges enfants
  if (!age_enfants) age_enfants = [];
  else if (typeof age_enfants === "string") {
    age_enfants = age_enfants.split(",").map(a => a.trim()).filter(a => a !== "");
  } else if (!Array.isArray(age_enfants)) {
    age_enfants = [];
  }

  const childrenAgesEncoded = encodeURIComponent(age_enfants.join(","));
  const url =
    `${URL_BOOKING_COM}?dest_id=${ville.dest_id}&search_type=CITY&arrival_date=${arrival_date}` +
    `&departure_date=${departure_date}&room_qty=${nbr_chambre}&adults=${nbr_adulte}&children_age=${childrenAgesEncoded}` +
    OPTIONAL_PARAMS;

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const hotels = result?.data?.data?.hotels || result?.data?.hotels || result?.hotels || [];

    const filteredHotels = hotels
      .filter(h => {
        const label = h.accessibilityLabel?.toLowerCase() || "";
        return (
          (label.includes("hotel") || label.includes("hôtel")) &&
          !label.includes("appartement") &&
          !label.includes("résidence") &&
          !label.includes("villa") &&
          !label.includes("maison") &&
          !label.includes("studio")
        );
      })
      .map(h => {
        const label = h.accessibilityLabel || "";
        const starsMatch = label.match(/(\d+)\s+étoile(?:s)?\s+sur\s+5/i);
        const etoiles = starsMatch ? parseInt(starsMatch[1], 10) : null;
        const priceEUR = h.property?.priceBreakdown?.grossPrice?.value || null;
        const prixDZD = priceEUR ? (priceEUR * EUR_TO_DZD).toFixed(2) : null;

        return {
          id: h.hotel_id,
          name: h.property?.name || label.split("\n")[0],
          adresse: h.property?.wishlistName || label.split("\n")[0],
          photos: h.property?.photoUrls?.slice(0, 3) || [],
          prix_euro: priceEUR,
          prix_dinare: prixDZD,
          etoiles,
          Note_moyenne: h.reviewScore || h.property?.reviewScore || null,
          Appréciation: h.reviewScoreWord || h.property?.reviewScoreWord || null,
          Nombre_avis: h.reviewCount || h.property?.reviewCount || null,
          latitude: h.property?.latitude || h.latitude || null,
          longitude: h.property?.longitude || h.longitude || null,
          ville: ville.nom,
          region: ville.region,
          villeId: ville.id,
        };
      });

    for (const hotel of filteredHotels) {
      try {
        await Hotel.upsert(hotel);
      } catch (err) {
        console.error(`Erreur lors de l'insertion de ${hotel.name} :`, err.message);
      }
    }

    return filteredHotels;
  } catch (error) {
    console.error("Erreur dans searchAndSaveHotelsForVille:", error.message);
    return [];
  }
};



const REGIONS_VALIDES = ['Monde', 'Algérie', 'Tunisie'];

service.createVille = async (nom, region, dest_id) => {
  if (!REGIONS_VALIDES.includes(region)) {
    throw new Error(`Région invalide : ${region}`);
  }
  return await Ville.create({ nom, region, dest_id });
};



service.getVilleById = async (villeId) => {
  return await Ville.findByPk(villeId);
};


service.getHotelById = async (id) => {
  return await Hotel.findByPk(id); // ou findOne({ where: { id } })
};


service.getAllVilles = async ({
  search = '',
  region,
  limit = 50,
  offset = 0,
  orderBy = 'createdAt',
  orderDir = 'ASC'
}) => {
  const whereClause = {};

  // Filtre texte sur nom
  if (search) {
    whereClause.nom = { [Op.like]: `%${search}%` };
  }

  // Filtre région (si fournie et valide)
  if (region && REGIONS_VALIDES.includes(region)) {
    whereClause.region = region;
  }

  // Requête avec pagination, tri, filtre
  const result = await Ville.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
    distinct: true
  });

  return {
    data: result.rows,
    total: result.count
  };
};

service.deleteVilleById = async (id) => {
  const ville = await Ville.findByPk(id);
  if (!ville) {
    throw new Error("Ville non trouvée");
  }
  await ville.destroy();
  return true;
};



module.exports = service;
