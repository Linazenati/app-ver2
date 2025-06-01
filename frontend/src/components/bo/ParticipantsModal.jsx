import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import visaService from '../../services-call/visa ';
import toast from 'react-hot-toast';
import "../../assets/bo/modal.css"

// Import du nouveau modal justificatifs
import JustificatifsModal from './JustificatifsModal';

const ParticipantsModal = ({ show, handleClose, visaId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nouveaux états pour modal justificatifs
  const [showJustificatifsModal, setShowJustificatifsModal] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);

  useEffect(() => {
    if (visaId && show) {
      setLoading(true);
      visaService.getParticipantsByVisaId(visaId)
        .then(res => {
          setParticipants(res.data);
        })
        .catch(err => {
          console.error("Erreur lors du chargement des participants :", err);
          toast.error("Erreur lors du chargement des participants");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visaId, show]);

  // Ouvrir le modal justificatifs avec l'id du participant
  const openJustificatifsModal = (participantId) => {
    setSelectedParticipantId(participantId);
    setShowJustificatifsModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-width" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Liste des participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Chargement des participants...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive size="sm">
              <thead className="table-light">
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Date Naissance</th>
                  <th>Lieu Naissance</th>
                  <th>Numéro Passeport</th>
                  <th>Délivrance Passeport</th>
                  <th>Expiration Passeport</th>
                  <th>Email</th>
                  <th>Adresse</th>
                  <th>Actions</th> {/* Colonne actions */}
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td>{p.prenom}</td>
                    <td>{p.nom}</td>
                    <td>{p.dateNaissance}</td>
                    <td>{p.lieuNaissance}</td>
                    <td>{p.numeroPasseport}</td>
                    <td>{p.delivrancePasseport}</td>
                    <td>{p.expirationPasseport}</td>
                    <td>{p.email}</td>
                    <td>{p.adresse}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => openJustificatifsModal(p.id)}
                      >
                        Voir justificatifs
                      </Button>
                    </td>
                  </tr>
                ))}
                {participants.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Aucun participant trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal justificatifs */}
      <JustificatifsModal
        show={showJustificatifsModal}
        handleClose={() => setShowJustificatifsModal(false)}
        participantId={selectedParticipantId}
      />
    </>
  );
};

export default ParticipantsModal;
