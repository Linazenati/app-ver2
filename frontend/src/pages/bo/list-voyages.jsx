import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import voyageService from "../../services-call/voyage";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";
import ModifierVoyageModal from "../../components/bo/ModifierVoyageModal";
import ModalPublicationVoyage from "../../components/bo/modalPublication";
import toast, { Toaster } from "react-hot-toast";

const Liste_voyages = () => {
  const [state, setState] = useState({
    voyages: [],
    count: 0,
    error: "",
    loading: false,
    search: "",
    limit: 5,
    offset: 0,
    orderBy: "createdAt",
    orderDir: "ASC",
    plateforme: "",
    estPublier: "",
    annee: "",
    mois: "",
    expandedRows: {},
  });

    const [showModal, setShowModal] = useState(false);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [successMessages, setSuccessMessages] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
   const [showModifierModal, setShowModifierModal] = useState(false);
  const [voyageToEdit, setVoyageToEdit] = useState(null);
   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);



   const handleOpenModal = (voyage) => {
    setSelectedVoyage(voyage);
    setShowModal(true);
    setSuccessMessages([]);
    setErrorMessages([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleVoyagePublished = (updatedVoyage) => {
    setState((prevState) => {
      const updatedVoyages = prevState.voyages.map((v) =>
        v.id === updatedVoyage.id ? updatedVoyage : v
      );
      return { ...prevState, voyages: updatedVoyages };
    });
  };

  const fetchVoyages = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: "" }));

      const params = {
        params: {
          search: state.search,
          limit: state.limit,
          offset: state.offset,
          orderBy: state.orderBy,
          orderDir: state.orderDir,
          plateforme: state.plateforme,
          est_publier: state.estPublier || undefined,
          annee_de_depart: state.annee || undefined,
          mois_de_depart: state.mois ? String(state.mois).padStart(2, '0') : undefined,
        },
      };

      const response = await voyageService.getAll(params);
      setState((prev) => ({
        ...prev,
        voyages: response.data.data || [],
        count: response.data.total || 0,
        loading: false,
      }));
      setTotalPages(Math.ceil(response.data.total / state.limit) || 1);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message ,
        loading: false,
      }));
    }
  }, [state.search, state.limit, state.offset, state.orderBy, state.orderDir, state.plateforme, state.estPublier, state.annee, state.mois]);

  useEffect(() => {
    fetchVoyages();
  }, [
    state.offset,
    state.limit,
    state.search,
    state.plateforme,
    state.estPublier,
    state.annee,
    state.mois,
    state.orderBy,
    state.orderDir,
  ]);

  const handleSort = (column) => {
    const newDir = state.orderBy === column && state.orderDir === "ASC" ? "DESC" : "ASC";
    setState((prev) => ({
      ...prev,
      orderBy: column,
      orderDir: newDir,
      offset: 0,
    }));
  };
  const handleFilterChange = (type, value) => {
    const updates = {};

    if (type === 'limit') {
      updates.limit = Number(value);
      updates.offset = 0;
    } else if (type === 'search') {
      updates.search = value;
    } else if (type === 'plateforme') {
      updates.plateforme = value;
    } else if (type === 'estPublier') {
      updates.estPublier = value;
    } else if (type === 'annee') {
      updates.annee = value.replace(/\D/g, '').slice(0, 4);
    } else if (type === 'mois') {
      const cleanedValue = value.replace(/\D/g, '');
      updates.mois = cleanedValue === '' ? '' : Math.max(1, Math.min(12, Number(cleanedValue)));
    }

    setState((prev) => ({ ...prev, ...updates }));
  };
  const handlePagination = (direction) => {
    const newOffset = direction === 'next'
      ? state.offset + state.limit
      : Math.max(0, state.offset - state.limit);
    setState((prev) => ({ ...prev, offset: newOffset }));
  };

   const confirmDeleteClick = (id) => {
    setIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    if (!idToDelete) return;

    try {
      await voyageService.remove(idToDelete);
      fetchVoyages();
      setSuccessMessages(["Le voyage a été supprimé avec succès."]);
          toast.success("Voyage supprimé avec succès !");
      setErrorMessages([]);
    } catch (error) {
      setErrorMessages(["Échec de la suppression du voyage."]);
          toast.error("Erreur lors de la suppression de Voyage");
      setSuccessMessages([]);
    }
  };


  const handleEdit = (voyage) => {
    setVoyageToEdit(voyage);
    setShowModifierModal(true);
  };

  return (
     <>
      <Toaster position="top-right" />
    <div className="p-3">
      <h3>Liste des voyages</h3>
      {state.error && <Alert variant="danger">{state.error}</Alert>}

      <Row className="mb-3 g-2 align-items-center">
         <Col md={3}>
          <Form.Control
            placeholder="Rechercher..."
            value={state.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Col>
       <Col md={2}>
          <Form.Select
            value={state.plateforme}
            onChange={(e) => handleFilterChange('plateforme', e.target.value)}
          >
            <option value="">Plateforme</option>
            <option value="site">Site</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </Form.Select>
        </Col>
         <Col md={2}>
          <Form.Select
            value={state.estPublier}
            onChange={(e) => handleFilterChange('estPublier', e.target.value)}
          >
            <option value="">Tous statuts</option>
            <option value="true">Publiés</option>
            <option value="false">Non publiés</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder="Année (ex: 2024)"
            value={state.annee}
            onChange={(e) => setState((prev) => ({ ...prev, annee: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder="Année (ex: 2024)"
            value={state.annee}
            onChange={(e) => handleFilterChange('annee', e.target.value)}
            min="2000"
            max="2100"
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('id')}>ID   {state.orderBy === 'id' && (
          state.orderDir === 'ASC' ? (
            <span className="ms-1 text-white">&#9650;</span> // flèche vers le haut
          ) : (
            <span className="ms-1 text-white">&#9660;</span> // flèche vers le bas
          )
        )}</th>
            <th >Titre</th>
            <th>Date De Départ</th>
            <th>Date De Retour</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.voyages.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.titre}</td>
              <td>{v.date_de_depart}</td>
              <td>{v.date_de_retour}</td>
              <td>
                <span className={`badge ${v.est_publier ? 'bg-success' : 'bg-secondary'}`}>{v.est_publier ? 'Publié' : 'Brouillon'}</span>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() =>handleOpenModal(v)}><Eye /> Voir</Button>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(v)}><Pencil /> Modifier</Button>
                <Button variant="danger" size="sm"  onClick={() => confirmDeleteClick(v.id)}><Trash /> Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <Button
              variant="outline-primary"
              onClick={() => handlePagination('prev')}
              disabled={state.offset === 0 || state.loading}
            >
              Précédent
            </Button>
            <span>
              Page {(state.offset / state.limit) + 1} / {Math.ceil(state.count / state.limit) || 1}
            </span>
            <Button
              variant="outline-primary"
              onClick={() => handlePagination('next')}
              disabled={state.offset + state.limit >= state.count || state.loading}
            >
              Suivant
            </Button>
      </div>
      
      {selectedVoyage && (
        <ModalPublicationVoyage
          visible={showModal}
          onClose={handleCloseModal}
          voyage={selectedVoyage}
          successMessages={successMessages}
          errorMessages={errorMessages}
          onPublished={handleVoyagePublished}
        />
      )}

       {voyageToEdit && (
        <ModifierVoyageModal

          show={showModifierModal}
          handleClose={() => setShowModifierModal(false)}
          voyageId={voyageToEdit.id}
          onUpdateSuccess={() => {
            setShowModifierModal(false);
            fetchVoyages();
          }}
        />
      )}

         <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Es-tu sûr de vouloir supprimer ce voyage ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
           </>

  );
};

export default Liste_voyages;
