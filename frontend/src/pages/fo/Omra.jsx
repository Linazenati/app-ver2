import { useEffect, useState } from "react";
import omraService from "../../services-call/omra";
import OmraCard from "../../components/fo/Omra-Card";
import { Spin, Empty } from "antd";

export default function ListeOmras() {
  const [omras, setOmras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOmras = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await omraService.getAll(token);
        const data = response.data;
        console.log(data);
        setOmras(data.rows); // Assure-toi que data.rows est bien un tableau
      } catch (error) {
        console.error("Erreur lors du chargement des Omras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOmras();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  if (omras.length === 0) {
    return (
      <div className="text-center p-4">
        <Empty description="Aucune Omra disponible pour le moment" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
  {omras.map((omra) => (
    <OmraCard key={omra.id} omra={omra} />
  ))}
</div>

  );
}
