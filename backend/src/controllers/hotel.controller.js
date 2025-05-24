const service = require("../services/hotel.service")

const controller = {}

controller.rechercher = async (req, res) => {
  try {
      const { ville, arrival_date, departure_date ,nbr_chambre,nbr_adulte, age_enfants} = req.query;
      
      const hotels = await service.find(ville, arrival_date, departure_date ,nbr_chambre,nbr_adulte, age_enfants);
    await service.saveHotelsInDB(hotels, ville);
    res.status(200).json({ success: true, data: hotels });
  }catch (error) {
    console.error(error);  // Log l'erreur pour mieux la diagnostiquer
    res.status(500).json({ success: false, message: error.message });
  }
};

controller.saveAllHotels = async (req, res) => {
  try {
    const { arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants } = req.query;

    console.log("Données reçues dans saveAllHotels:", req.query);

    if (!arrival_date || !departure_date || !nbr_chambre || !nbr_adulte) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    await service.saveAllHotels(arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants);
    res.status(200).json({ success: true, message: "Tous les hôtels ont été enregistrés avec succès." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


controller.recupererHotelByVille = async (req, res) => {
  try {
    const { ville } = req.params;
    
    if (!ville) {
      return res.status(400).json({ success: false, message: "Ville obligatoire" });
    }

    const hotels = await service.getHotelsFromDbByVille(ville);

    // parser les photos
const hotelsAvecPhotosParsees = hotels.map(hotel => ({
  ...hotel,
  photos: typeof hotel.photos === 'string' ? JSON.parse(hotel.photos) : hotel.photos
}));
    
    res.status(200).json({ success: true, data: hotelsAvecPhotosParsees });
  } catch (error) {
    console.error("Erreur lors de la récupération depuis la DB:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

controller.getVillesByRegion = (req, res) => {
  const region = req.params.region;
  if (!region) {
    return res.status(400).json({ error: "La région est requise" });
  }

  const villes = service.getVillesByRegion(region);

  if (villes.length === 0) {
    return res.status(404).json({ message: `Aucune ville trouvée pour la région '${region}'` });
  }

  return res.json(villes);
};


controller.searchRealTime = async (req, res) => {
    try {
        const { ville, arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants } = req.query;

        if (!ville || !arrival_date || !departure_date || !nbr_chambre || !nbr_adulte) {
            return res.status(400).json({ message: "Tous les paramètres sont requis" });
        }

        const hotels = await service.searchRealTimeAvailability(ville, arrival_date, departure_date, nbr_chambre, nbr_adulte, age_enfants);
        res.json(hotels);
    } catch (error) {
        console.error("Erreur recherche en temps réel :", error.message);
        res.status(500).json({ message: "Erreur serveur lors de la recherche en temps réel" });
    }
};


controller.getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await service.getHotelById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hôtel non trouvé' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = controller;