import React, { useEffect, useState } from 'react';
import villeService from '../../services-call/hotel'; // adapte le chemin

 function Liste_ville() {
  // États pour données, pagination, filtres et chargement
  const [villes, setVilles] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Chargement des données selon filtres et pagination
  const fetchVilles = async () => {
  setLoading(true);
  try {
    const params = { search, region, limit, offset };
    const res = await villeService.getAll(params);
    // Corrigé ici :
    setVilles(res.data.data);
    setTotal(res.data.total);
    console.log('Response:', res.data);
  } catch (error) {
    console.error('Erreur fetch villes:', error);
    alert('Erreur lors du chargement des villes');
  }
  setLoading(false);
};

  useEffect(() => {
    fetchVilles();
  }, [search, region, limit, offset]);

  // Supprimer une ville
  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await villeService.remove(id);
      // Recharger liste (retourner à la page 0 si la page actuelle devient vide)
      if (villes.length === 1 && offset > 0) setOffset(offset - limit);
      else fetchVilles();
    } catch (error) {
      console.error('Erreur suppression ville:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Pagination (page suivante / précédente)
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Liste des villes</h2>

      {/* Filtres */}
      <div className="mb-4 flex gap-4 flex-wrap">
       
        <select
          value={region}
          onChange={(e) => { setOffset(0); setRegion(e.target.value); }}
          className="border px-2 py-1 rounded"
        >
          <option value="">Toutes régions</option>
          <option value="Monde">Monde</option>
          <option value="Algérie">Algérie</option>
          <option value="Tunisie">Tunisie</option>
        </select>

        
         
            
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Nom</th>
            <th className="border px-3 py-2 text-left">Région</th>
            <th className="border px-3 py-2 text-left">dest_id</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="text-center py-4">Chargement...</td>
            </tr>
          )}

          {!loading && villes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">Aucune ville trouvée.</td>
            </tr>
          )}

          {!loading && villes.map((ville) => (
            <tr key={ville.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{ville.nom}</td>
              <td className="border px-3 py-2">{ville.region}</td>
              <td className="border px-3 py-2">{ville.dest_id}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => handleDelete(ville.id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => canPrev && setOffset(offset - limit)}
          disabled={!canPrev}
          className={`px-3 py-1 rounded border ${canPrev ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}`}
        >
          Précédent
        </button>

        <span>
          {(offset / limit) + 1} / {Math.ceil(total / limit)} (Total : {total})
        </span>

        <button
          onClick={() => canNext && setOffset(offset + limit)}
          disabled={!canNext}
          className={`px-3 py-1 rounded border ${canNext ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
export default Liste_ville;