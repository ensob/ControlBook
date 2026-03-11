import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Layout from '../components/Layout';

export default function AdminDashboard() {
  // Inicializamos como array vacío para evitar errores de undefined
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFichajes();
  }, []);

  const fetchFichajes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fichajes')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      
      // Si data es null, usamos array vacío
      setFichajes(data || []); 
    } catch (err) {
      console.error("Error al cargar:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Cargando...</div>;

  return (
    <Layout>
      <h2 className="text-2xl font-black text-white mb-6">Control de Fichajes</h2>
      <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="p-4">Alumno</th>
              <th className="p-4">Equipo</th>
              <th className="p-4">Hora entrada</th>
              <th className="p-4">Hora salida</th>
              <th className="p-4">Absentismo</th>
            </tr>
          </thead>
          <tbody>
            {fichajes && fichajes.length > 0 ? (
              fichajes.map((f) => (
                <tr key={f.id} className="border-t border-gray-700">
                  <td className="p-4">{f.nombre || 'N/A'}</td>
                  <td className="p-4">{f.equipo || 'N/A'}</td>
                  <td className="p-4">{f.hora_entrada || '-'}</td>
                  <td className="p-4">{f.hora_salida || '-'}</td>
                  <td className="p-4">{f.absentismo ? 'Sí' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No hay fichajes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
