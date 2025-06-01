import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import toast, { Toaster } from "react-hot-toast";

import serviceVisa from "../../services-call/visa "; // Corrigé : pas d’espace à la fin

// 1. Import du modal participants
import ParticipantsModal from "../../components/bo/ParticipantsModal";

const ListeVisas = () => {
  const [visas, setVisas] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    limit: 5,
    offset: 0,
    orderBy: "createdAt",
    orderDir: "ASC",
    typeVisa: "",
    pays: ""
  });

  // 2. État pour gérer ouverture modal et visa sélectionné
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisaId, setSelectedVisaId] = useState(null);

  const fetchVisas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await serviceVisa.getAllVisas({ params: filters });
      const { data } = response;

      setVisas(data.data || []);
      setCount(data.total || 0);
    } catch (err) {
      console.error("Erreur fetchVisas:", err);
      setError(err.response?.data?.message || "Erreur lors de la récupération des visas.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVisas();
  }, [fetchVisas]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      offset: 0
    }));
  };

  const handleSort = (column) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: column,
      orderDir: prev.orderBy === column && prev.orderDir === "ASC" ? "DESC" : "ASC",
      offset: 0
    }));
  };

  const handlePagination = (direction) => {
    setFilters((prev) => ({
      ...prev,
      offset: direction === "next" ? prev.offset + prev.limit : Math.max(0, prev.offset - prev.limit)
    }));
  };

  // 3. Fonction ouverture modal + set visaId
  const openModal = (visaId) => {
    setSelectedVisaId(visaId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVisaId(null);
  };

  return (
    <div className="p-3">
      <Toaster position="top-right" />
      <h3>Liste des visas</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3 g-2 align-items-center">
        <Col md={3}>
          <Form.Control
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select value={filters.typeVisa} onChange={(e) => handleFilterChange("typeVisa", e.target.value)}>
            <option value="">Tous types</option>
            <option value="Etudes">Etudes</option>
            <option value="Tourisme">Tourisme</option>
            <option value="Affaires">Affaires</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filters.pays} onChange={(e) => handleFilterChange("pays", e.target.value)}>
            <option value="">Tous pays</option>
            <option value="France">France</option>
            <option value="Canada">Canada</option>
            <option value="États-Unis">États-Unis</option>
            <option value="Maroc">Maroc</option>
            <option value="Turquie">Turquie</option>
            <option value="Allemagne">Allemagne</option>
            <option value="Italie">Italie</option>
            <option value="Espagne">Espagne</option>
            <option value="Qatar">Qatar</option>
            <option value="Egypte">Egypte</option>
            <option value="Thailande">Thailande</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Azerbaïdjan">Azerbaïdjan</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("id")}>ID {filters.orderBy === "id" && (filters.orderDir === "ASC" ? "▲" : "▼")}</th>
            <th>Pays</th>
            <th>Type Visa</th>
            <th>Nombre Personnes</th>
            <th>Date d'Arrivée</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center">
                <Spinner animation="border" /> Chargement...
              </td>
            </tr>
          ) : visas.length > 0 ? (
            visas.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.pays}</td>
                <td>{v.typeVisa}</td>
                <td>{v.personnes}</td>
                <td>{v.dateArrivee}</td>
                <td>{v.total}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="warning" size="sm" onClick={() => openModal(v.id)}>
                      <Eye /> Voir plus
                    </Button>
                    <Button variant="danger" size="sm">Refuser</Button>
                    <Button variant="success" size="sm">Demander Paiement</Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Aucune donnée trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <Button
          variant="outline-primary"
          onClick={() => handlePagination("prev")}
          disabled={filters.offset === 0 || loading}
        >
          Précédent
        </Button>
        <span>
          Page {Math.floor(filters.offset / filters.limit) + 1} / {Math.ceil(count / filters.limit) || 1}
        </span>
        <Button
          variant="outline-primary"
          onClick={() => handlePagination("next")}
          disabled={filters.offset + filters.limit >= count || loading}
        >
          Suivant
        </Button>
      </div>

      {/* 5. Le modal avec ses props */}
      <ParticipantsModal
        show={isModalOpen}
        handleClose={closeModal}
        visaId={selectedVisaId}
      />
    </div>
  );
};

export default ListeVisas;
