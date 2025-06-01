const service = require("../services/hotel.service")
const controller = {}


controller.getAllVilles = async (req, res) => {
 try {
    const { region } = req.params;
    const villes = await service.getallVilles(region);
    res.status(200).json(villes);
  } catch (error) {
    console.error('Erreur lors de la récupération des villes par région :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

controller.getHotelsByVilleId = async (req, res) => {
  const { villeId } = req.params;

  try {
    if (!villeId) {
      return res.status(400).json({ message: "Paramètre 'villeId' manquant" });
    }

    const hotels = await service.findHotelsByVilleId(villeId);

    res.json(hotels);
  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

controller.searchAndSaveHotelsForVille = async (req, res) => {
  const {
    villeNom,
    arrival_date,
    departure_date,
    nbr_chambre,
    nbr_adulte,
    age_enfants
  } = req.query;

  try {
    if (!villeNom || !arrival_date || !departure_date || !nbr_chambre || !nbr_adulte) {
      return res.status(400).json({ message: "Paramètres obligatoires manquants." });
    }

    const hotels = await service.searchAndSaveHotelsForVille(
      villeNom,
      arrival_date,
      departure_date,
      parseInt(nbr_chambre),
      parseInt(nbr_adulte),
      age_enfants
    );

    res.status(200).json(hotels);
  } catch (error) {
    console.error("Erreur dans searchAndSaveHotelsForVille (controller):", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la recherche des hôtels.", error: error.message });
  }
};



controller.create = async (req, res) => {
  const { nom, region, dest_id } = req.body;
  try {
    const newVille = await service.createVille(nom, region, dest_id);
    res.status(201).json(newVille);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de la ville", error: error.message });
  }
};
controller.getVilleById = async (req, res) => {
  const { villeId } = req.params;
  try {
    const ville = await service.getVilleById(villeId);
    if (!ville) {
      return res.status(404).json({ message: "Ville non trouvée" });
    }
    res.status(200).json(ville);
  } catch (error) {
    console.error("Erreur lors de la récupération de la ville :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


controller.getHotelById = async (req, res) => {
  const { idhotel} = req.params;
  console.log("ID brut reçu :", idhotel, "Type :", typeof idhotel);
  const parsedId = parseInt(idhotel, 10); // 🔥 Important si l'ID est string

  try {
    const hotel = await service.getHotelById(parsedId);
    if (!hotel) {
      return res.status(404).json({ message: "Hôtel non trouvé" });
    }
    res.json(hotel);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'hôtel :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



controller.getAll = async (req, res) => {
  try {
    const {
      search = '',
      region,
      limit = 50,
      offset = 0,
      orderBy = 'createdAt',
      orderDir = 'ASC',
    } = req.query;

    const result = await service.getAllVilles({
      search,
      region,
      limit,
      offset,
      orderBy,
      orderDir,
    });

    res.json({
      success: true,
      total: result.total,
      data: result.data
    });
  } catch (error) {
    console.error('Erreur controller getAll:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

controller.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteVilleById(id);
    res.json({
      success: true,
      message: 'Ville supprimée avec succès'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Ville non trouvée'
    });
  }
};


module.exports = controller;