import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import publicationService from "../../services-call/publication"; // Créer le service pour les publications

const ListePublications = () => {
  const [publications, setPublications] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
 const [platformFilter, setPlatformFilter] = useState("");
 const [serviceFilter, setServiceFilter] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("ASC");
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);

  // Chargement des publications
  const fetchPublications = async () => {
    try {
      const response = await publicationService.getAll({
        params: {
          search,
         plateforme: platformFilter,  // ⚠️ correspond bien à ce que le backend attend
         type: serviceFilter,     
          limit,
          offset,
          orderBy,
          orderDir,
        
        },
      });

      setPublications(response.data.rows);
      setCount(response.data.count);
    } catch (error) {
      console.error("Erreur lors de la récupération des publications", error);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [search, platformFilter, orderBy, orderDir, limit, offset ,serviceFilter,]);

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderDir(orderDir === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(column);
      setOrderDir("ASC");
    }
  };

  const handlePrev = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  const handleNext = () => {
    if (offset + limit < count) {
      setOffset(offset + limit);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      try {
        await publicationService.deleteItem(id);
        fetchPublications(); // Recharger les publications après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
  };

  return (
    <div className="p-3">
      <h3>Liste des publications</h3>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Rechercher une publication..."
            value={search}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="">type de platforme </option>
            <option value="site">Site</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </Form.Select>
              </Col>
              
              <Col md={3}>
          <Form.Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">Type de service</option>
            <option value="voyage">Voyage</option>
            <option value="omra">Omra</option>
    
          </Form.Select>
              </Col>
              
        <Col md={3}>
          <Form.Select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0); // Retourner à la première page
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID Publication {orderBy === "id" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("date_publication")} style={{ cursor: "pointer" }}>
              Date de publication {orderBy === "date_publication" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("service")} style={{ cursor: "pointer" }}>
              Service {orderBy === "service" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("platforme")} style={{ cursor: "pointer" }}>
              Plateforme {orderBy === "platforme" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publications.map((pub) => (
            <tr key={pub.id}>
              <td>{pub.id}</td>
              <td>{pub.date_publication}</td>
<td>
  {pub.voyage
    ? `Voyage : ${pub.voyage.titre}`
    : pub.omra
    ? `Omra : ${pub.omra.nom}`
    : "Non défini"}
</td>              <td>{pub.plateforme}</td>
                  <td>
                <Button variant="warning" size="sm" className="me-2">
                  Voir
                </Button>
                <Button variant="warning" size="sm" className="me-2">
                  Modifier
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(pub.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <Button onClick={handlePrev} disabled={offset === 0}>
          ◀ Précédent
        </Button>
        <span>
          Page {Math.floor(offset / limit) + 1} / {Math.ceil(count / limit)}
        </span>
        <Button onClick={handleNext} disabled={offset + limit >= count}>
          Suivant ▶
        </Button>
      </div>
    </div>
  );
};

export default ListePublications;
