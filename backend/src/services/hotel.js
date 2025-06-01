const { Hotel } = require('../models'); // adapte le chemin selon ta structure
const axios = require("axios");
const service = {}

const VILLES_IDS = {
//algérie
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

//tunis
    "Tunis" : "-731701",
    "Hammamet": "-722356",
    "Sousse": "-731250",
    "Monastir": "-728914",
    " Mahdia": "-722531",
    "Tozeur": "-731519",
    
//dans le monde
    "Paris": "-1456928",
    "Marseille": "-1449947",
    "montréal":"-569541",
    "Istanbul":"-755070",
    "London": "-2601889",
    "Barcelona": "-372490",
    "Valence": "-1474436",
    "Venise": "-132007 ",
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
};
const URL_BOOKING_COM = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"
const OPTIONAL_PARAMS = "&page_number=1&units=metric&temperature_unit=c&languagecode=fr&currency_code=EUR&location=US"

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '6761c199f8msh08da520f135ee89p129be6jsn149a961b3909',
		'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
	}
};
const  EUR_TO_DZD = 149.74; 

service.find = async (ville, arrival_date, departure_date, nbr_chambre, nbr_adulte,age_enfants) => {
    const data = null;

    const dest_id = VILLES_IDS[ville];
    if (!dest_id) {
        console.error(`Ville inconnue ou non supportée: ${ville}`);
        return [];
    }
    const region = VILLES_REGIONS[ville] || "Monde";

    // Si aucun âge n'est fourni, on envoie une chaîne vide
      if (!age_enfants) {
        age_enfants = [];
    } else if (typeof age_enfants === 'string') {
        age_enfants = age_enfants.split(',').map(a => a.trim()).filter(a => a !== '');
    } else if (!Array.isArray(age_enfants)) {
        age_enfants = [];
    }
    const encodedChildrenAges = encodeURIComponent(age_enfants.length > 0 ? age_enfants.join(',') : '');    
    const url = URL_BOOKING_COM
        + `?dest_id=${dest_id}&search_type=CITY&arrival_date=${arrival_date}&departure_date=${departure_date}&room_qty=${nbr_chambre}&adults=${nbr_adulte}&children_age=${encodedChildrenAges}`
        + OPTIONAL_PARAMS;
    

    const response = await fetch(url, options);
    const result = await response.json();

console.log("API response:", JSON.stringify(result, null, 2)); // <--- Debug

    const hotels = (
        (result.data && result.data.data && result.data.data.hotels) ||
        (result.data && result.data.hotels) ||
        result.hotels ||
        []
    );
 const filteredHotels = hotels
        .filter(hotel => {
            const label = hotel.accessibilityLabel?.toLowerCase() || "";
            const isHotel = label.includes("hotel") || label.includes("hôtel") ||   label.includes("Hotel") ||  label.includes("Hôtel");
            const isNotOther = !label.includes("appartement") &&
                !label.includes("résidence") &&
                !label.includes("villa") &&
                !label.includes("maison") &&
                !label.includes("studio");
            return isHotel && isNotOther;
        })
        .map(hotel => {
            const priceEUR = hotel.property?.priceBreakdown?.grossPrice?.value || null;
            const label = hotel.accessibilityLabel || "";
            const starsMatch = label.match(/(\d+)\s+étoile(?:s)?\s+sur\s+5/i);
            const stars = starsMatch ? parseInt(starsMatch[1], 10) : null;
        return {
            id: hotel.hotel_id,
            nom: hotel.property?.name || hotel.accessibilityLabel?.split('\n')[0],
             accessibilityLabel: label,
             etoile: stars , // ⭐ Ajout ici
            adresse: hotel.property?.wishlistName || hotel.accessibilityLabel?.split('\n')[0],
            photos: hotel.property?.photoUrls?.slice(0, 3) || [],
            prixEUR: priceEUR,
            prixDZD: priceEUR ? (priceEUR * EUR_TO_DZD ).toFixed(2): null,
            Note_moyenne: hotel.reviewScore || hotel.property?.reviewScore || null,
            Appréciation: hotel.reviewScoreWord || hotel.property?.reviewScoreWord || null,  // Ajouté ici
            Nombre_avis: hotel.reviewCount || hotel.property?.reviewCount || null,
            Localisation: {
                Latitude: hotel.property?.latitude || hotel.latitude || null,
                Longitude: hotel.property?.longitude || hotel.longitude || null,
            },
             region: region

        };
    });

    return filteredHotels;
}





//enregistrer les hotels d'une ville dans la base
service.saveHotelsInDB = async (hotelsArray, ville) => {
      console.log(`Enregistrement de ${hotelsArray.length} hôtels pour la ville ${ville}`);
    for (const h of hotelsArray) {
      try {
    await Hotel.upsert({
      id: h.id,
      name: h.nom,
      ville: ville, // maintenant ville est bien défini
      region: h.region,
      adresse: h.adresse,
      latitude: h.Localisation.Latitude,
      longitude: h.Localisation.Longitude,
      etoiles: h.etoile,
      photos: h.photos,
      Note_moyenne: h.Note_moyenne,
      Appréciation: h.Appréciation,
      Nombre_avis: h.Nombre_avis,
    });
      console.log(`Hotel ${h.nom} enregistré`);
    } catch (error) {
      console.error(`Erreur en enregistrant l'hôtel ${h.nom}:`, error.message);
    }
  }
}


///enregistrer les hotels de  plusieurs villes 
service.saveAllHotels = async (arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants) => {
  for (const ville of Object.keys(VILLES_IDS)) {
    try {
      console.log(`Récupération des hôtels pour ${ville}`);
        const hotels = await service.find(ville, arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants);
        console.log("🟡 Données envoyées à l'API externe :", {
  arrival_date,
  departure_date,
  adults: nbr_adulte,
  room_qty: nbr_chambre,
  age_enfants
});
      if (hotels.length > 0) {
        await service.saveHotelsInDB(hotels, ville);
        console.log(`✔️ Enregistré ${hotels.length} hôtels pour ${ville}`);
      } else {
        console.log(`❌ Aucun hôtel trouvé pour ${ville}`);
      }
    } catch (err) {
      console.error(`Erreur pour ${ville}:`, err.message);
    }
  }
}



service.getHotelsFromDbByVille = async (ville) => {
  return await Hotel.findAll({ where: { ville } });
};



service.getVillesByRegion = (region) => {
  return Object.entries(VILLES_REGIONS)
    .filter(([ville, reg]) => reg.toLowerCase() === region.toLowerCase())
    .map(([ville]) => ville);
}
service.searchRealTimeAvailability = async (
  ville,
  arrival_date,
  departure_date,
  nbr_chambre,
  nbr_adulte,
  age_enfants
) => {
  try {
    const hotelsEnBase = await service.getHotelsFromDbByVille(ville);
    const dest_id = VILLES_IDS[ville];

    if (!dest_id) {
      console.error(`Ville inconnue ou non supportée: ${ville}`);
      return [];
    }

    if (!age_enfants) {
      age_enfants = [];
    } else if (typeof age_enfants === 'string') {
      age_enfants = age_enfants.split(',').map(a => a.trim()).filter(a => a !== '');
    } else if (!Array.isArray(age_enfants)) {
      age_enfants = [];
    }

    const encodedChildrenAges = encodeURIComponent(age_enfants.length > 0 ? age_enfants.join(',') : '');

    const url = URL_BOOKING_COM
      + `?dest_id=${dest_id}&search_type=CITY&arrival_date=${arrival_date}&departure_date=${departure_date}&room_qty=${nbr_chambre}&adults=${nbr_adulte}&children_age=${encodedChildrenAges}`
      + OPTIONAL_PARAMS;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Booking API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    const hotels = (
      (result.data && result.data.data && result.data.data.hotels) ||
      (result.data && result.data.hotels) ||
      result.hotels ||
      []
    );

    const filtered = hotels.filter(h => hotelsEnBase.some(dbHotel => dbHotel.id == h.hotel_id));

    for (const hotel of filtered) {
  const priceEUR = hotel.property?.priceBreakdown?.grossPrice?.value || null;
  const label = hotel.accessibilityLabel || "";
  const starsMatch = label.match(/(\d+)\s+étoile(?:s)?\s+sur\s+5/i);
  const stars = starsMatch ? parseInt(starsMatch[1], 10) : null;
  const prixDZD = priceEUR ? (priceEUR * EUR_TO_DZD).toFixed(2) : null;

  try {
    const [updatedRowsCount] = await Hotel.update(
      {
        prix_euro: priceEUR,
        prix_dinare: prixDZD
      },
      {
        where: { id: hotel.hotel_id }
      }
    );

    if (updatedRowsCount > 0) {
      console.log(`✅ Prix mis à jour pour l'hôtel ID ${hotel.hotel_id} : ${priceEUR} EUR / ${prixDZD} DZD`);
    } else {
      console.warn(`⚠️ Aucune ligne mise à jour pour l'hôtel ID ${hotel.hotel_id} (peut-être introuvable en base)`);
    }

  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du prix pour l'hôtel ID ${hotel.hotel_id} :`, error.message);
  }
}


    return filtered.map(hotel => {
      const priceEUR = hotel.property?.priceBreakdown?.grossPrice?.value || null;
      const label = hotel.accessibilityLabel || "";
      const starsMatch = label.match(/(\d+)\s+étoile(?:s)?\s+sur\s+5/i);
      const stars = starsMatch ? parseInt(starsMatch[1], 10) : null;

      return {
        id: hotel.hotel_id,
        nom: hotel.property?.name || hotel.accessibilityLabel?.split('\n')[0],
        adresse: hotel.property?.wishlistName || label,
        etoile: stars,
        prixEUR: priceEUR,
        prixDZD: priceEUR ? (priceEUR * EUR_TO_DZD).toFixed(2) : null,
        Note_moyenne: hotel.reviewScore || hotel.property?.reviewScore || null,
        Appréciation: hotel.reviewScoreWord || hotel.property?.reviewScoreWord || null,
        Nombre_avis: hotel.reviewCount || hotel.property?.reviewCount || null,
        photos: hotel.property?.photoUrls?.slice(0, 3) || [],
        Localisation: {
          Latitude: hotel.property?.latitude || hotel.latitude || null,
          Longitude: hotel.property?.longitude || hotel.longitude || null,
        }
      };
    });
  } catch (error) {
    console.error("❌ Erreur dans searchRealTimeAvailability :", error.message);
    throw error; // permettra au contrôleur d'envoyer une erreur 500 correcte
  }
};

service.getHotelById = async (id) => {
  try {
    const hotel = await Hotel.findByPk(id);
    return hotel;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'hôtel :", error.message);
    return null;
  }
};
module.exports = service;