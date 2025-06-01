import React from 'react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaIdCard, FaEnvelope, FaHome, FaFileUpload } from 'react-icons/fa';

const Step2 = ({ data, onChange }) => (
  <div>
    <h5>Coordonnées des participants</h5>

    <div className="mb-3">
      <label><FaUser className="me-2 text-primary" />Prénom*</label>
      <input type="text" className="form-control" name="prenom" value={data.prenom} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaUser className="me-2 text-success" />Nom*</label>
      <input type="text" className="form-control" name="nom" value={data.nom} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaCalendarAlt className="me-2 text-info" />Date de naissance*</label>
      <input type="date" className="form-control" name="dateNaissance" value={data.dateNaissance} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaMapMarkerAlt className="me-2 text-warning" />Lieu de naissance*</label>
      <input type="text" className="form-control" name="lieuNaissance" value={data.lieuNaissance} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaIdCard className="me-2 text-danger" />Numéro de passeport*</label>
      <input type="text" className="form-control" name="numeroPasseport" value={data.numeroPasseport} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaCalendarAlt className="me-2 text-primary" />Date de délivrance du passeport</label>
      <input type="date" className="form-control" name="delivrancePasseport" value={data.delivrancePasseport} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaCalendarAlt className="me-2 text-secondary" />Date d'expiration du passeport</label>
      <input type="date" className="form-control" name="expirationPasseport" value={data.expirationPasseport} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaEnvelope className="me-2 text-success" />Adresse email*</label>
      <input type="email" className="form-control" name="email" value={data.email} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaHome className="me-2 text-warning" />Adresse de résidence*</label>
      <input type="text" className="form-control" name="adresse" value={data.adresse} onChange={onChange} />
    </div>
    <div className="mb-3">
      <label><FaFileUpload className="me-2 text-info" />Scan du passeport et carte d'identité (PDF, JPG, PNG)</label>
      <input
        type="file"
        name="justificatifs"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        className="form-control"
        onChange={(e) => onChange(e)} // On laisse la logique au parent
        required
      />
    </div>
  </div>
);

export default Step2;
