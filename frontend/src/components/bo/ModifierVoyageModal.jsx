import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import VoyageService from '../../services-call/voyage';
import toast from "react-hot-toast";

const ModifierVoyageModal = ({ show, handleClose, voyageId, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
      description: '',
     date_de_depart: '',
    date_de_retour: ''
  });

  useEffect(() => {
    if (voyageId) {
      VoyageService.getById(voyageId)
        .then((res) => {
          const data = res.data;
          setFormData({
            titre: data.titre || '',
            prix: data.prix || '',
              description: data.description || '',
               date_de_depart: data.date_de_depart ? data.date_de_depart.split('T')[0] : '',
            date_de_retour: data.date_de_retour ? data.date_de_retour.split('T')[0] : ''
            
          });
        })
        .catch((err) => console.error('Erreur lors du chargement du voyage :', err));
    }
  }, [voyageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
  if (!voyageId) return;

  VoyageService.update(voyageId, formData)
    .then(() => {
      onUpdateSuccess();
      handleClose();
      toast.success("Voyage modifié avec succès !");
    })
    .catch((err) => {
      console.error("Erreur lors de la mise à jour :", err);
      toast.error("Erreur lors de la mise à jour du voyage");
    });
};

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le voyage</Modal.Title>
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

          <Form.Group controlId="formDateRetour" className="mb-3">
            <Form.Label>Date de Retour</Form.Label>
            <Form.Control type="date" name="date_de_retour" value={formData.date_de_retour} onChange={handleChange} />
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

export default ModifierVoyageModal;
