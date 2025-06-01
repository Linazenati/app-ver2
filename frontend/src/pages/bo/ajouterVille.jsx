import React, { useState } from "react";
import hotelService from "../../services-call/hotel";
import toast, { Toaster } from "react-hot-toast";

const ajouterVille = ({ onSuccess }) => {
  const [nom, setNom] = useState("");
  const [region, setRegion] = useState("");
  const [destId, setDestId] = useState("");

  const [loading, setLoading] = useState(false);

  const REGIONS_VALIDES = ["Monde", "Algérie", "Tunisie"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        nom,
        region,
        dest_id: destId,
      };

      await hotelService.create(data);
      toast.success("Ville ajoutée avec succès !");
      setNom("");
      setRegion("");
      setDestId("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

    return (
      <>
      <Toaster position="top-right" />
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
<h2 style={{ textAlign: 'center' ,  color: '#05396d'}}> Ajouter une ville</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nom</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Région</label>
        <select
          className="w-full border p-2 rounded"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">-- Sélectionnez une région --</option>
          {REGIONS_VALIDES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Destination ID (dest_id)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={destId}
          onChange={(e) => setDestId(e.target.value)}
          required
        />
      </div>
<button      type="primary" htmlType="submit" block   disabled={loading}>
  {loading ? "Ajout en cours..." : "Ajouter la ville"}
</button>

            </form>
             </>
  );
};
     

export default ajouterVille;
