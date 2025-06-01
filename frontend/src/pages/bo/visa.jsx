import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Row, Col, Alert } from "react-bootstrap";
import serviceVisa from "../../services-call/visa "
import { Eye, Pencil } from "react-bootstrap-icons";
import toast, { Toaster } from "react-hot-toast";

const Liste_visas = () => {
  const [state, setState] = useState({
    visas: [],
    count: 0,
    error: "",
    loading: false,
    search: "",
    limit: 5,
    offset: 0,
    orderBy: "createdAt",
    orderDir: "ASC",
    typeVisa: "",
    pays: "",
  });

  const fetchVisas = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: "" }));

      const params = {
        params: {
          search: state.search,
          limit: state.limit,
          offset: state.offset,
          orderBy: state.orderBy,
          orderDir: state.orderDir,
          typeVisa: state.typeVisa,
          pays: state.pays,
        },
      };

      console.log("Requête envoyée avec les paramètres :", params);

      const response = await serviceVisa.getAllVisas(params);
      console.log("Réponse reçue :", response.data);

      setState((prev) => ({
        ...prev,
        visas: response.data.data || [],
        count: response.data.total || 0,
        loading: false,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Erreur",
        loading: false,
      }));
    }
  }, [state.search, state.limit, state.offset, state.orderBy, state.orderDir, state.typeVisa, state.pays]);

  useEffect(() => {
    fetchVisas();
  }, [fetchVisas]);

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
    if (type === "limit") updates.limit = Number(value), updates.offset = 0;
    else if (type === "search") updates.search = value;
    else if (type === "pays") updates.pays = value;
    else if (type === "typeVisa") updates.typeVisa = value;

    setState((prev) => ({ ...prev, ...updates }));
  };

  const handlePagination = (direction) => {
    const newOffset = direction === "next" ? state.offset + state.limit : Math.max(0, state.offset - state.limit);
    setState((prev) => ({ ...prev, offset: newOffset }));
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-3">
        <h3>Liste des visas</h3>
        {state.error && <Alert variant="danger">{state.error}</Alert>}

        <Row className="mb-3 g-2 align-items-center">
          <Col md={3}>
            <Form.Control
              placeholder="Rechercher..."
              value={state.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select value={state.typeVisa} onChange={(e) => handleFilterChange("typeVisa", e.target.value)}>
              <option value="">Tous types</option>
              <option value="etudes">Etudes</option>
              <option value="tourisme">Tourisme</option>
              <option value="affaire">Affaire</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={state.pays} onChange={(e) => handleFilterChange("pays", e.target.value)}>
              <option value="">Tous statuts</option>
              <option value="true">Publiés</option>
              <option value="false">Non publiés</option>
            </Form.Select>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("id")}>
                ID {state.orderBy === "id" && (state.orderDir === "ASC" ? "▲" : "▼")}
              </th>
              <th>Pays</th>
              <th>Type Visa</th>
              <th>Nombre Personnes</th>
              <th>Date d'Arrivée</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.visas.length > 0 ? (
              state.visas.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.pays}</td>
                  <td>{v.typeVisa}</td>
                  <td>{v.personnes}</td>
                  <td>{v.dateArrivee}</td>
                  <td>{v.total}</td>
                  <td>
                    <span className={`badge ${v.est_publier ? "bg-success" : "bg-secondary"}`}>
                      {v.est_publier ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td>
                    <Button disabled variant="info" size="sm" className="me-2">
                      <Eye /> Voir
                    </Button>
                    <Button disabled variant="warning" size="sm">
                      <Pencil /> Modifier
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Aucune donnée trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <Button variant="outline-primary" onClick={() => handlePagination("prev")} disabled={state.offset === 0 || state.loading}>
            Précédent
          </Button>
          <span>
            Page {(state.offset / state.limit) + 1} / {Math.ceil(state.count / state.limit) || 1}
          </span>
          <Button
            variant="outline-primary"
            onClick={() => handlePagination("next")}
            disabled={state.offset + state.limit >= state.count || state.loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </>
  );
};

export default Liste_visas;
