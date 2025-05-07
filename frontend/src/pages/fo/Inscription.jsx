import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/inscription.css";
import authAPI from "../../services-call/auth";

import toast, { Toaster } from 'react-hot-toast';

const Inscription = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    adresse:'',
    role: 'Utilisateur_inscrit'
  });

 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    
      // Enregistrement
      const registerResponse = await authAPI.register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        telephone: parseInt(formData.telephone),
        adresse:formData.adresse,
        role: formData.role
      });

      console.log("Register Response:", registerResponse);
      // alert("Inscription réussie ! Connexion en cours...");
      
      toast.success('Inscription réussie ! Connexion en cours...');

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate("/web/Connexion"); // ou "/login" si tu préfères
      }, 2000);

   
  };

  return (
    <div className="form-container">
      <h2>Créer un Compte</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
         <div className="form-group">
          <label htmlFor="dresse">Adresse</label>
          <input type="adresse" id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-btn">S'inscrire</button>
      </form>

      <Toaster />
    </div>
  );
};

export default Inscription;
