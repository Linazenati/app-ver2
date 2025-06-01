import React from 'react';
import { FaGlobe, FaPassport, FaUsers, FaFlag, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaEnvelope, FaHome, FaMoneyBillWave } from 'react-icons/fa';

const visaPrices = {
  Tourisme: 6000,
  Affaires: 8000,
  Etudes: 10000
};

const Step4 = ({ formData, participants, total }) => {
  const prixUnitaire = visaPrices[formData.typeVisa] || 0;
  
  // Affichage résumé premier participant (adapter si besoin)
  const participant = participants[0] || {};

  return (
    <div>
      <h5>Résumé de votre demande</h5>
      <ul className="list-group">
        <li className="list-group-item"><FaGlobe className="me-2 text-primary" /><strong>Pays :</strong> {formData.pays}</li>
        <li className="list-group-item"><FaPassport className="me-2 text-secondary" /><strong>Type de Visa :</strong> {formData.typeVisa}</li>
        <li className="list-group-item"><FaUsers className="me-2 text-success" /><strong>Nombre de personnes :</strong> {formData.personnes}</li>
        <li className="list-group-item"><FaFlag className="me-2 text-danger" /><strong>Nationalité :</strong> {formData.nationalite}</li>
        <li className="list-group-item"><FaCalendarAlt className="me-2 text-warning" /><strong>Date d'arrivée :</strong> {formData.dateArrivee}</li>

        <hr />

        <li className="list-group-item"><FaUser className="me-2 text-info" /><strong>Prénom :</strong> {participant.prenom}</li>
        <li className="list-group-item"><FaUser className="me-2 text-info" /><strong>Nom :</strong> {participant.nom}</li>
        <li className="list-group-item"><FaCalendarAlt className="me-2 text-info" /><strong>Date de naissance :</strong> {participant.dateNaissance}</li>
        <li className="list-group-item"><FaMapMarkerAlt className="me-2 text-info" /><strong>Lieu de naissance :</strong> {participant.lieuNaissance}</li>
        <li className="list-group-item"><FaPassport className="me-2 text-info" /><strong>Numéro Passeport :</strong> {participant.numeroPasseport}</li>
        <li className="list-group-item"><FaCalendarAlt className="me-2 text-info" /><strong>Délivrance Passeport :</strong> {participant.delivrancePasseport}</li>
        <li className="list-group-item"><FaCalendarAlt className="me-2 text-info" /><strong>Expiration Passeport :</strong> {participant.expirationPasseport}</li>
        <li className="list-group-item"><FaEnvelope className="me-2 text-info" /><strong>Email :</strong> {participant.email}</li>
        <li className="list-group-item"><FaHome className="me-2 text-info" /><strong>Adresse :</strong> {participant.adresse}</li>

        <hr />

        <li className="list-group-item">
          <FaMoneyBillWave className="me-2 text-success" />
          <strong>Prix unitaire :</strong> {prixUnitaire} DZD
        </li>
        <li className="list-group-item">
          <FaMoneyBillWave className="me-2 text-success" />
          <strong>Total :</strong> {total} DZD
        </li>
      </ul>
    </div>
  );
};

export default Step4;
