import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Layout from '../components/Layout';

export default function AdminDashboard() {
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFichajes();
  }, []);

  const fetchFichajes = async () => {
    setLoading(true);
    try {
      // Intentamos la consulta con el join
      const { data, error } = await supabase
        .from('fichajes')
        .select(`
          id, 
          estado, 
          timestamp, 
          alumnos (nombre_completo, equipo)
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setFichajes(data || []);
    } catch (error) {
      console.error("Error al obtener fichajes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando datos...</div>;

  return (
    <Layout>
      <h2 className="text-2xl font-black text-white mb-6">Control de Fichajes</h2>
      <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="p-4">Alumno</th>
              <th className="p-4">Equipo</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Hora</th>
            </tr>
          </thead>
          <tbody>
            {fichajes.map((f) => (
              <tr key={f.id} className="border-t border-gray-700">
                <td className="p-4">{f.alumnos?.nombre_completo || 'Desconocido'}</td>
                <td className="p-4">{f.alumnos?.equipo || '-'}</td>
                <td className={`p-4 font-bold ${f.estado === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                  {f.estado.toUpperCase()}
                </td>
                <td className="p-4">{new Date(f.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}