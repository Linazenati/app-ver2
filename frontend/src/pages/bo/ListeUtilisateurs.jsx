import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import utilisateur from "../../services-call/utilisateur";

const ListeUtilisateurs = ({ currentUser }) => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("ASC");
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Chargement des utilisateurs
  const fetchUtilisateurs = async () => {
    try {
      const response = await utilisateur.getAll({
        params: {
          search,
          role: roleFilter,
          limit,
          offset,
          orderBy,
          orderDir,  
        },
      });

      setUtilisateurs(response.data.rows);
      setCount(response.data.count);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, [search, roleFilter, orderBy, orderDir, limit, offset]);

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
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    try {
      await utilisateur.deleteItem(id);
      // Optionnel : rafraîchir la liste après suppression
      fetchUtilisateurs(); // une fonction que tu as probablement déjà
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }
};

  const handleEdit = (user) => {
  setSelectedUser(user);
  setShowModal(true);
};

  const handleSearchChange = (e) => {
  setSearch(e.target.value.trim());
  };
  
  return (
    <div className="p-3">
      <h3>Liste des utilisateurs</h3>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={handleSearchChange}          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="utilisateur_inscrit">Utilisateur inscrit</option>
            <option value="administrateur">Administrateur</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0); // pour revenir à la première page quand on change le nombre d'éléments par page
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
              ID {orderBy === "id" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("nom")} style={{ cursor: "pointer" }}>
              Nom {orderBy === "nom" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {orderBy === "email" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
              Rôle {orderBy === "role" && (orderDir === "ASC" ? "▲" : "▼")}
            </th>
              <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nom} {user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>              
                <td>
                  <Button variant="warning" size="sm" className="me-2"   onClick={() => handleEdit(user)}>
                    Modifier
                  </Button>
                  <Button variant="danger" size="sm"  onClick={() => handleDelete(user.id)}>
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
          Page {Math.floor(offset / limit) + 1} /{" "}
          {Math.ceil(count / limit)}
        </span>
        <Button
          onClick={handleNext}
          disabled={offset + limit >= count}
        >
          Suivant ▶
        </Button>
      </div>
    </div>
  );
};

export default ListeUtilisateurs;
