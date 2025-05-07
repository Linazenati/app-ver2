import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Logo from "../../assets/img/LogoZiguade.jpg";
import "../../assets/css/connexion.css";

import { useUser } from '../../contexts/UserContext';

import authAPI from "../../services-call/auth";
import { useNavigate } from 'react-router-dom';


function Connexion() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour traiter la soumission du formulaire
    console.log('Email:', email);
    console.log('Mot de passe:', password);

    try{
      const response = await authAPI.login({email,password});
      console.log(response.data);

      const session = response.data.data;
      const role = session.utilisateur.role;
      setUser( session );
      toast.success("Connexion reussié")

      //Redirection après 2 secondes
      setTimeout(() => {
        if (role == "Utilisateur_inscrit"){
          navigate("/web/Home");
        }
        else{ //admin et agent
          navigate("/admin");
        }
        
      }, 1000);
    }
    catch(err){
      toast.error("Connexion échouée");
      console.log(err);
    }

  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Logo Ziguade" className="login-logo" />
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Se connecter</button>
      </form>

      <Toaster />
    </div>
  );
}

export default Connexion;
