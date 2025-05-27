// services/assuranceService.js
const { Assurance } = require('../models');

const getAllAssurances = () => {
  return Assurance.findAll();
};

const getAssuranceById = (id) => {
  return Assurance.findByPk(id);
};

const createAssurance = (data) => {
  return Assurance.create(data);
};

const updateAssurance = async (id, data) => {
  const assurance = await Assurance.findByPk(id);
  if (!assurance) return null;
  await assurance.update(data);
  return assurance;
};

const deleteAssurance = async (id) => {
  const assurance = await Assurance.findByPk(id);
  if (!assurance) return null;
  await assurance.destroy();
  return assurance;
};

module.exports = {
  getAllAssurances,
  getAssuranceById,
  createAssurance,
  updateAssurance,
  deleteAssurance,
};
