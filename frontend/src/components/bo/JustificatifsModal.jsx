import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, Spinner } from 'react-bootstrap';
import visaService from '../../services-call/visa ';
import toast from 'react-hot-toast';

const JustificatifsModal = ({ show, handleClose, participantId }) => {
  const [justificatifs, setJustificatifs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (participantId && show) {
      setLoading(true);
      visaService.getJustificatifsByParticipantId(participantId)
        .then(res => {
          setJustificatifs(res.data);
        })
        .catch(err => {
          console.error("Erreur chargement justificatifs :", err);
          toast.error("Erreur lors du chargement des justificatifs");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [participantId, show]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Justificatifs du participant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Chargement des justificatifs...</p>
          </div>
        ) : justificatifs.length > 0 ? (
          <ListGroup>
            {justificatifs.map((j) => (
              <ListGroup.Item key={j.id}>
                {/* Par exemple afficher le nom original et un lien vers le fichier */}
                <a
  href={`http://localhost:3000/images/${j.filename}`}
  target="_blank"
  rel="noopener noreferrer"
>
  {j.originalName}
</a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Aucun justificatif trouvé pour ce participant.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JustificatifsModal;
