import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import omraService from '../../services-call/omra'; // chemin adapté selon ton projet
import toast from "react-hot-toast";

const ModifierOmraModal = ({ show, handleClose, omraId, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
    description: '',
    date_de_depart: '',
    statut: ''
  });

  useEffect(() => {
    if (omraId) {
      omraService.getById(omraId)
        .then((res) => {
          const data = res.data;
          setFormData({
            titre: data.titre || '',
            prix: data.prix || '',
            description: data.description || '',
            date_de_depart: data.date_de_depart ? data.date_de_depart.split('T')[0] : '',
            statut: data.statut || ''
          });
        })
        .catch((err) => console.error('Erreur lors du chargement de l\'Omra :', err));
    }
  }, [omraId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!omraId) return;

    omraService.update(omraId, formData)
      .then(() => {
        onUpdateSuccess();
        handleClose();
        toast.success("Omra modifiée avec succès !");
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour :", err);
        toast.error("Erreur lors de la mise à jour de l'Omra");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'Omra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitre" className="mb-3">
            <Form.Label>Titre</Form.Label>
            <Form.Control type="text" name="titre" value={formData.titre} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formPrix" className="mb-3">
            <Form.Label>Prix</Form.Label>
            <Form.Control type="number" name="prix" value={formData.prix} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formDateDepart" className="mb-3">
            <Form.Label>Date de Départ</Form.Label>
            <Form.Control type="date" name="date_de_depart" value={formData.date_de_depart} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formStatut" className="mb-3">
            <Form.Label>Statut</Form.Label>
            <Form.Control as="select" name="statut" value={formData.statut} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              <option value="en_attente">disponible</option>
              <option value="valide">épuisé</option>
            </Form.Control>
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

export default ModifierOmraModal;
