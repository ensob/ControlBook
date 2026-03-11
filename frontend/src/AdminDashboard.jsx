import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import Layout from './components/Layout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Estados
  const [alumnos, setAlumnos] = useState([]);
  const [fichajes, setFichajes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [areas, setAreas] = useState('');
  const [loading, setLoading] = useState(false);

  // Función de carga de datos (fuera de useEffect para reusarla)
  const cargarTodo = async () => {
    try {
      const { data: dataAlumnos, error: errAlumnos } = await supabase
        .from('alumnos')
        .select('*')
        .order('nombre_completo', { ascending: true });

      const { data: dataFichajes, error: errFichajes } = await supabase
        .from('fichajes')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora_entrada', { ascending: false });

      if (errAlumnos) console.error("Error alumnos:", errAlumnos);
      if (errFichajes) console.error("Error fichajes:", errFichajes);

      setAlumnos(dataAlumnos || []);
      setFichajes(dataFichajes || []);
    } catch (error) {
      console.error("Error crítico en carga:", error);
    }
  };

  // useEffect simple sin dependencias que causen bucles
  useEffect(() => {
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agregarAlumno = async () => {
    if (!nombre || !areas) return alert("Completa los campos");
    setLoading(true);
    const { error } = await supabase.from('alumnos').insert([{ nombre_completo: nombre, areas }]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      setNombre('');
      setAreas('');
      await cargarTodo(); // Recargar tras insertar
    }
    setLoading(false);
  };

  const eliminarAlumno = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este alumno?")) return;
    const { error } = await supabase.from('alumnos').delete().eq('id', id);
    if (error) alert(error.message);
    else await cargarTodo();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 space-y-10">
        
        {/* Header con Logout */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-800">
          <div>
            <h2 className="text-3xl font-black italic text-orange-500 tracking-tighter">ADMIN DASHBOARD</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Gestión de ControlBook</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-2xl transition-all active:scale-95 text-sm"
          >
            CERRAR SESIÓN
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Gestión */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-[#1e1e1e] p-6 rounded-[2.5rem] border border-gray-700 shadow-xl">
              <h3 className="text-lg font-black mb-4 uppercase text-white italic">Nuevo Alumno</h3>
              <div className="space-y-3">
                <input 
                  placeholder="Nombre y Apellidos" 
                  className="bg-[#2a2a2a] p-4 rounded-2xl w-full text-white border border-transparent focus:border-orange-500 outline-none transition-all" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                />
                <input 
                  placeholder="Equipo / Área" 
                  className="bg-[#2a2a2a] p-4 rounded-2xl w-full text-white border border-transparent focus:border-orange-500 outline-none transition-all" 
                  value={areas} 
                  onChange={e => setAreas(e.target.value)} 
                />
                <button 
                  onClick={agregarAlumno} 
                  disabled={loading}
                  className="w-full bg-orange-500 font-black py-4 rounded-2xl text-black hover:bg-orange-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'AÑADIENDO...' : 'AÑADIR ALUMNO'}
                </button>
              </div>
            </section>

            <section className="bg-[#1e1e1e] p-6 rounded-[2.5rem] border border-gray-700 max-h-[500px] overflow-y-auto">
              <h3 className="text-lg font-black mb-4 uppercase text-white italic">Alumnos ({alumnos.length})</h3>
              <div className="space-y-3">
                {alumnos.map(a => (
                  <div key={a.id} className="flex justify-between items-center bg-[#2a2a2a] p-4 rounded-2xl border border-gray-800 group">
                    <div>
                      <p className="font-bold text-gray-100 leading-tight">{a.nombre_completo}</p>
                      <p className="text-[10px] text-orange-500 font-black uppercase tracking-tighter">{a.equipo}</p>
                    </div>
                    <button 
                      onClick={() => eliminarAlumno(a.id)} 
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                    >
                      <span className="text-xs font-bold">BORRAR</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Fichajes */}
          <div className="lg:col-span-2">
            <section className="bg-[#1e1e1e] p-8 rounded-[2.5rem] border border-gray-700 shadow-xl h-full">
              <h2 className="text-xl font-black mb-6 uppercase text-white italic tracking-widest">Historial de Fichajes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left uppercase text-[10px] font-black border-b border-gray-800">
                      <th className="pb-4 px-2">Alumno</th>
                      <th className="pb-4 px-2">Área</th>
                      <th className="pb-4 px-2 text-center">Fecha</th>
                      <th className="pb-4 px-2 text-right">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {fichajes.map(f => (
                      <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-2 font-bold text-gray-200">{f.nombre}</td>
                        <td className="py-4 px-2 text-orange-500 font-medium">{f.equipo}</td>
                        <td className="py-4 px-2 text-gray-400 text-center">{f.fecha}</td>
                        <td className="py-4 px-2 text-gray-100 text-right font-mono">{f.hora_entrada}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </div>
    </Layout>
  );
}
