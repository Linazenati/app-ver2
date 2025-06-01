import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import authAPI from '../../services-call/auth';
import toast, { Toaster } from "react-hot-toast";

const Inscription = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    adresse: '',
    role: 'Utilisateur_inscrit',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      message.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const registerResponse = await authAPI.register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        telephone: parseInt(formData.telephone),
        adresse: formData.adresse,
        role: formData.role,
      });

      console.log("Register Response:", registerResponse);
      toast.success("Inscription réussie ! Connexion en cours...");

      setTimeout(() => {
        navigate("/web/Connexion");
      }, 2000);
    } catch (error) {
      console.error(error);
       toast.error("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: '40px' }}>
      <h2 style={{ textAlign: 'center' ,  color: '#05396d'}}>Créer un Compte</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nom" required>
          <Input name="nom" value={formData.nom} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Prénom" required>
          <Input name="prenom" value={formData.prenom} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Téléphone" required>
          <Input name="telephone" type="tel" value={formData.telephone} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Email" required>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Mot de passe" required>
          <Input.Password name="password" value={formData.password} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Confirmer le mot de passe" required>
          <Input.Password name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Adresse" required>
          <Input name="adresse" value={formData.adresse} onChange={handleChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
      </div>
      </>
  );
};

export default Inscription;
