import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function FichajePage() {
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const navigate = useNavigate();

  // Función para formatear fechas y horas de manera consistente con Supabase
  const formatSupabaseDateTime = (date) => {
    return date.toISOString();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour12: false });
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const { data, error } = await supabase
          .from('alumnos')
          .select('*');
        if (error) throw error;
        setAlumnos(data);
      } catch (error) {
        console.error('Error fetching alumnos:', error);
      }
    };

    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('areas')
          .select('*');
        if (error) throw error;
        setAreas(data);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAlumnos();
    fetchAreas();
  }, []);

  // Función para formatear fechas y horas de manera consistente con Supabase
const formatSupabaseDateTime = (date) => {
  return date.toISOString();
};

const formatTime = (date) => {
  return date.toLocaleTimeString('es-ES', { hour12: false });
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const handleFichar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();

    const { error } = await supabase
      .from('fichajes')
      .insert([
        {
          nombre: selectedAlumno,
          equipo: selectedArea,
          fecha: formatDate(now),
          hora_entrada: formatTime(now),
          created_at: formatSupabaseDateTime(now),
          absentismo: false
        }
      ]);

    if (error) {
      console.error("Error al guardar en Supabase:", error);
      alert("Error: " + error.message);
    } else {
      alert("¡Fichaje registrado con éxito!");
      setSelectedAlumno('');
      setSelectedArea('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8 font-sans flex flex-col items-center">
      {/* Header */}
      <header className="max-w-md w-full mb-10 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter">
          CONTROL<span className="text-orange-500 underline decoration-2 underline-offset-4">BOOK</span>
        </h1>
        <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-2 font-bold">VideoProduction Studio Management</p>
      </header>

      {/* Contenedor Principal Unificado */}
      <div className="max-w-md w-full bg-[#1e1e1e] p-8 rounded-[2.5rem] border border-gray-700 shadow-2xl">
        <form onSubmit={handleFichar} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
              Seleccionar Alumno
            </label>
            <select 
              value={selectedAlumno}
              onChange={(e) => setSelectedAlumno(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-orange-500 outline-none" 
              required
            >
              <option value="">Selecciona un alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.nombre_completo || alumno.nombre}>
                  {alumno.nombre_completo || alumno.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
              Seleccionar Área
            </label>
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-600 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-orange-500 outline-none" 
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.nombre}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={async () => {
                setLoading(true);
                const now = new Date();
                const { error } = await supabase
                  .from('fichajes')
                  .insert([
                    {
                      nombre: selectedAlumno,
                      equipo: selectedArea,
                      fecha: formatDate(now),
                      hora_entrada: formatTime(now),
                      created_at: formatSupabaseDateTime(now),
                      absentismo: false
                    }
                  ]);
                if (error) {
                  console.error("Error al guardar en Supabase:", error);
                  alert("Error: " + error.message);
                } else {
                  alert("¡Entrada registrada con éxito!");
                  setSelectedAlumno('');
                  setSelectedArea('');
                }
                setLoading(false);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(249,115,22,0.2)]"
            >
              {loading ? 'PROCESANDO...' : 'ENTRADA'}
            </button>
            <button 
              type="button"
              onClick={async () => {
                const hoy = formatDate(new Date());
                const ahora = formatTime(new Date());
                
                setLoading(true);
                
                // 1. Intentamos actualizar el registro de HOY que esté abierto (hora_salida sea null)
                const { data, error } = await supabase
                  .from('fichajes')
                  .update({ 
                    hora_salida: ahora,
                    updated_at: formatSupabaseDateTime(new Date())
                  })
                  .eq('nombre', selectedAlumno)
                  .eq('fecha', hoy)
                  .is('hora_salida', null)
                  .select(); // El select nos permite saber si realmente se actualizó algo
                
                if (error) {
                  alert("Error técnico: " + error.message);
                } else if (data && data.length === 0) {
                  // Si no se actualizó nada, es porque no hay un fichaje de entrada hoy
                  alert("❌ No puedes fichar salida: O ya has fichado salida hoy, o no has fichado entrada todavía.");
                } else {
                  alert(`✅ Salida registrada a las ${ahora}. ¡Buen trabajo!`);
                  setSelectedAlumno('');
                  setSelectedArea('');
                }
                setLoading(false);
              }}
              className="flex-1 bg-green-500 hover:bg-green-400 text-black font-black py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(249,115,22,0.2)]"
            >
              {loading ? 'PROCESANDO...' : 'SALIDA'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <button 
          onClick={() => navigate('/admin')}
          className="text-gray-600 hover:text-orange-500 text-[10px] uppercase font-bold tracking-widest transition-colors"
        >
          Zona de Gestión Administrativa
        </button>
      </footer>
    </div>
  );
}
