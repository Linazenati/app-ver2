import React from 'react';
import {
  FaGlobe, FaPassport, FaUsers, FaFlag, FaMoneyBillWave, FaCalendarAlt
} from 'react-icons/fa';

const visaPrices = {
  France: { Tourisme: 10000, Affaires: 15000, Etudes: 8000 },
  Canada: { Tourisme: 12000, Affaires: 17000, Etudes: 9000 },
  "États-Unis": { Tourisme: 15000, Affaires: 20000, Etudes: 11000 },
  Maroc: { Tourisme: 8000, Affaires: 12000, Etudes: 6000 },
  Turquie: { Tourisme: 7000, Affaires: 10000, Etudes: 5000 },
  Allemagne: { Tourisme: 11000, Affaires: 16000, Etudes: 8500 },
  Italie: { Tourisme: 10500, Affaires: 15500, Etudes: 8000 },
  Espagne: { Tourisme: 10200, Affaires: 15200, Etudes: 7800 },
  Qatar: { Tourisme: 13000, Affaires: 18000, Etudes: 9500 },
  Egypte: { Tourisme: 7000, Affaires: 11000, Etudes: 5000 },
  Thailande: { Tourisme: 9000, Affaires: 13000, Etudes: 7000 },
  Vietnam: { Tourisme: 8500, Affaires: 12500, Etudes: 6800 },
  Azerbaïdjan: { Tourisme: 8000, Affaires: 12000, Etudes: 6500 }
};

const Step1 = ({ data, onChange }) => {
  const prixUnitaire = (visaPrices[data.pays] && visaPrices[data.pays][data.typeVisa]) || 0;

  return (
    <div className="p-3">
     
      
      {/* Formulaire */}
      <div className="mb-3">
        <label><FaGlobe className="me-2 text-primary" />Pays*</label>
        <select name="pays" className="form-control" value={data.pays} onChange={onChange}>
          <option value="">Choisir un pays</option>
          {Object.keys(visaPrices).map(pays => (
            <option key={pays} value={pays}>{pays}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label><FaPassport className="me-2 text-success" />Type de Visa*</label>
        <select name="typeVisa" className="form-control" value={data.typeVisa} onChange={onChange}>
          <option value="">Choisir un type</option>
          <option value="Tourisme">Tourisme</option>
          <option value="Affaires">Affaires</option>
          <option value="Etudes">Etudes</option>
        </select>
      </div>

      {data.pays && data.typeVisa && (
        <div className="mb-3">
          <label><FaMoneyBillWave className="me-2 text-info" />Prix par personne</label>
          <input type="text" className="form-control" value={`${prixUnitaire} DA`} disabled />
        </div>
      )}

      <div className="mb-3">
        <label><FaUsers className="me-2 text-warning" />Nombre de personnes*</label>
        <input type="number" name="personnes" className="form-control" value={data.personnes} onChange={onChange} />
      </div>

      <div className="mb-3">
        <label><FaFlag className="me-2 text-danger" />Nationalité*</label>
        <input type="text" name="nationalite" className="form-control" value={data.nationalite} onChange={onChange} />
      </div>

      <div className="mb-3">
        <label><FaCalendarAlt className="me-2 text-primary" />Date d’arrivée*</label>
        <input type="date" name="dateArrivee" className="form-control" value={data.dateArrivee} onChange={onChange} />
      </div>
    </div>
  );
};

export default Step1;
