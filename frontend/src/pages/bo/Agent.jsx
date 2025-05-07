import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

function Agent() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    matricule: '',
    dateEmbauche: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Ici, vous pouvez envoyer les données à votre backend.
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 form-container">
          <h2 className="text-center mb-4">Ajouter un Agent</h2>
          <form onSubmit={handleSubmit}>
            {/* Nom */}
            <div className="mb-3">
              <label htmlFor="nom" className="form-label">Nom <i className="fa fa-user"></i></label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="form-control"
                placeholder="Nom de l'agent"
                required
              />
            </div>

            {/* Prénom */}
            <div className="mb-3">
              <label htmlFor="prenom" className="form-label">Prénom <i className="fa fa-user"></i></label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="form-control"
                placeholder="Prénom de l'agent"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email <i className="fa fa-envelope"></i></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email de l'agent"
                required
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe <i className="fa fa-lock"></i></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Mot de passe"
                required
              />
            </div>

            {/* Téléphone */}
            <div className="mb-3">
              <label htmlFor="telephone" className="form-label">Téléphone <i className="fa fa-phone"></i></label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="form-control"
                placeholder="Numéro de téléphone"
                required
              />
            </div>

            {/* Matricule */}
            <div className="mb-3">
              <label htmlFor="matricule" className="form-label">Matricule <i className="fa fa-id-card"></i></label>
              <input
                type="text"
                id="matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className="form-control"
                placeholder="Matricule de l'agent"
                required
              />
            </div>

            {/* Date d'embauche */}
            <div className="mb-3">
              <label htmlFor="dateEmbauche" className="form-label">Date d'embauche <i className="fa fa-calendar"></i></label>
              <input
                type="date"
                id="dateEmbauche"
                name="dateEmbauche"
                value={formData.dateEmbauche}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary">Ajouter l'Agent</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Agent;
