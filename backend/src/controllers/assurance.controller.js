// controllers/assuranceController.js
const assuranceService = require('../services/assurance.service');

const getAll = async (req, res) => {
  const assurances = await assuranceService.getAllAssurances();
  res.json(assurances);
};

const getById = async (req, res) => {
  const id = req.params.id;
  const assurance = await assuranceService.getAssuranceById(id);
  if (!assurance) return res.status(404).json({ message: 'Assurance non trouvée' });
  res.json(assurance);
};

const create = async (req, res) => {
  try {
    console.log("Données reçues :", req.body); // 👈 À vérifier
    console.log("Fichier reçu :", req.file);   // 👈 À vérifier

    const newAssurance = await assuranceService.createAssurance(req.body);

    res.status(201).json(newAssurance);
  } catch (err) {
    console.error("Erreur création assurance :", err);
    res.status(400).json({ message: 'Erreur lors de la création', error: err.message });
  }
};


const update = async (req, res) => {
  const id = req.params.id;
  const updated = await assuranceService.updateAssurance(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Assurance non trouvée' });
  res.json(updated);
};

const remove = async (req, res) => {
  const id = req.params.id;
  const deleted = await assuranceService.deleteAssurance(id);
  if (!deleted) return res.status(404).json({ message: 'Assurance non trouvée' });
  res.json({ message: 'Assurance supprimée' });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
