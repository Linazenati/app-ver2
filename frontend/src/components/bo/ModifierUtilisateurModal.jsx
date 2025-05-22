import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import UtilisateurService from '../../services-call/utilisateur'; // adapte le chemin selon ton projet
import toast from "react-hot-toast";

const ModifierUtilisateurModal = ({ show, handleClose, utilisateurId, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    if (utilisateurId) {
      UtilisateurService.getById(utilisateurId)
        .then((res) => {
          const data = res.data;
          setFormData({
            nom: data.nom || '',
            prenom: data.prenom || '',
            email: data.email || '',
            telephone: data.telephone || '',
          });
        })
          .catch((err) => console.error('Erreur lors du chargement de l\'utilisateur :', err),
      )    }
  }, [utilisateurId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  if (!utilisateurId) return;

  try {
    const res = await UtilisateurService.updateItem(utilisateurId, formData);
    const updatedUser = res.data;
    console.log("Utilisateur mis à jour :", updatedUser);
    toast.success("Utilisateur modifié avec succès !");
    onUpdateSuccess(updatedUser);
    handleClose();
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    toast.error("Erreur lors de la mise à jour de l'utilisateur");
  }
};
    return (
      
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNom" className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formPrenom" className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>


          <Form.Group controlId="formTelephone" className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annuler</Button>
        <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifierUtilisateurModal;
