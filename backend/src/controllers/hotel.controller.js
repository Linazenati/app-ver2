const service = require("../services/hotel.service")

const controller = {}

controller.find = async (req, res) => {
  try {
      const { ville, arrival_date, departure_date } = req.query;
      
      const hotels = await service.find(ville, arrival_date, departure_date);

      res.status(200).json({ success: true, data: hotels });
  }catch (error) {
    console.error(error);  // Log l'erreur pour mieux la diagnostiquer
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;