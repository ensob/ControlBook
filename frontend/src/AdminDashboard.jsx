import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Estados principales
  const [alumnos, setAlumnos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
  
  // Formulario Alumno
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [equipoAlumno, setEquipoAlumno] = useState('');
  
  // Formulario Área
  const [nombreArea, setNombreArea] = useState('');
  
  // Filtros Fichajes
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroAlumno, setFiltroAlumno] = useState('');

  // Estados para edición de fichajes
  const [editingFichaje, setEditingFichaje] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    equipo: '',
    fecha: '',
    hora_entrada: '',
    hora_salida: '',
    absentismo: false
  });

  // Función de carga de datos
  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [respAlumnos, respAreas, respFichajes] = await Promise.all([
        supabase.from('alumnos').select('*').order('nombre_completo', { ascending: true }),
        supabase.from('areas').select('*'),
        supabase.from('fichajes').select('*').order('fecha', { ascending: false }).order('hora_entrada', { ascending: false })
      ]);

      if (respAlumnos.error) console.error("Error alumnos:", respAlumnos.error);
      if (respAreas.error) console.error("Error areas:", respAreas.error);
      if (respFichajes.error) console.error("Error fichajes:", respFichajes.error);

      setAlumnos(respAlumnos.data || []);
      setAreas(respAreas.data || []);
      setFichajes(respFichajes.data || []);
    } catch (error) {
      console.error("Error crítico en carga:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // GESTIÓN DE ALUMNOS
  const agregarAlumno = async () => {
    if (!nombreAlumno || !equipoAlumno) return alert("Completa todos los campos");
    setLoading(true);
    const { error } = await supabase.from('alumnos').insert([{ 
      nombre_completo: nombreAlumno, 
      equipo: equipoAlumno 
    }]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      setNombreAlumno('');
      setEquipoAlumno('');
      await cargarTodo();
    }
    setLoading(false);
  };

  const eliminarAlumno = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este alumno?")) return;
    const { error } = await supabase.from('alumnos').delete().eq('id', id);
    if (error) alert(error.message);
    else await cargarTodo();
  };

  // GESTIÓN DE ÁREAS
  const agregarArea = async () => {
    if (!nombreArea) return alert("Introduce el nombre del área");
    setLoading(true);
    const { error } = await supabase.from('areas').insert([{ nombre: nombreArea }]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      setNombreArea('');
      await cargarTodo();
    }
    setLoading(false);
  };

  const eliminarArea = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta área?")) return;
    const { error } = await supabase.from('areas').delete().eq('id', id);
    if (error) alert(error.message);
    else await cargarTodo();
  };

  // FILTRADO DE FICHAJES
  const fichajeFiltrados = fichajes.filter(f => {
    const cumpleFiltroArea = !filtroArea || f.equipo === filtroArea;
    const cumpleFiltroFecha = !filtroFecha || f.fecha === filtroFecha;
    const cumpleFiltroAlumno = !filtroAlumno || f.nombre.toLowerCase().includes(filtroAlumno.toLowerCase());
    return cumpleFiltroArea && cumpleFiltroFecha && cumpleFiltroAlumno;
  });

  // EXPORTAR A CSV
  const exportarCSV = () => {
    if (fichajeFiltrados.length === 0) return alert("No hay datos para exportar");
    
    const headers = ['Alumno', 'Área', 'Fecha', 'Hora', 'Absentismo'];
    const rows = fichajeFiltrados.map(f => [
      f.nombre,
      f.equipo,
      f.fecha,
      f.hora_entrada,
      f.absentismo ? 'Sí' : 'No'
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fichajes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Funciones para editar fichajes
  const openEditModal = (fichaje) => {
    setEditingFichaje(fichaje);
    setEditFormData({
      nombre: fichaje.nombre || '',
      equipo: fichaje.equipo || '',
      fecha: fichaje.fecha || new Date().toISOString().split('T')[0],
      hora_entrada: fichaje.hora_entrada || '',
      hora_salida: fichaje.hora_salida || '',
      absentismo: fichaje.absentismo || false
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingFichaje(null);
    setEditFormData({
      nombre: '',
      equipo: '',
      fecha: '',
      hora_entrada: '',
      hora_salida: '',
      absentismo: false
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Ensure we have a valid fichaje ID
      if (!editingFichaje || !editingFichaje.id) {
        throw new Error("ID de fichaje no válido");
      }
      
      const updateData = {
        nombre: editFormData.nombre,
        equipo: editFormData.equipo,
        fecha: editFormData.fecha,
        hora_entrada: editFormData.hora_entrada,
        absentismo: editFormData.absentismo
      };
      
      // Only add hora_salida if it's provided
      if (editFormData.hora_salida) {
        updateData.hora_salida = editFormData.hora_salida;
      }
      
      const { error } = await supabase
        .from('fichajes')
        .update(updateData)
        .eq('id', editingFichaje.id);
      
      if (error) {
        alert("Error al actualizar el fichaje: " + error.message);
      } else {
        await cargarTodo();
        closeEditModal();
        alert("Fichaje actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al actualizar fichaje:", error);
      alert("Error al actualizar el fichaje: " + error.message);
    }
    setLoading(false);
  };

  // Function to delete a fichaje
  const deleteFichaje = async (fichajeId) => {
    if (!fichajeId) {
      alert("ID de fichaje no válido");
      return;
    }
    
    if (!window.confirm("¿Estás seguro de que quieres eliminar este fichaje? Esta acción no se puede deshacer.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('fichajes')
        .delete()
        .eq('id', fichajeId);
      
      if (error) {
        alert("Error al eliminar el fichaje: " + error.message);
      } else {
        await cargarTodo();
        alert("Fichaje eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar fichaje:", error);
      alert("Error al eliminar el fichaje: " + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-800">
          <div>
            <h2 className="text-3xl font-black italic text-orange-500 tracking-tighter">ADMIN DASHBOARD</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Gestión completa de ControlBook</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-2xl transition-all active:scale-95 text-sm"
          >
            CERRAR SESIÓN
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-gray-700 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase">Total Alumnos</p>
            <p className="text-2xl font-black text-orange-500">{alumnos.length}</p>
          </div>
          <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-gray-700 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase">Áreas Activas</p>
            <p className="text-2xl font-black text-white">{areas.length}</p>
          </div>
        </div>

        {/* Grid principal 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLUMNA 1: GESTIÓN DE ALUMNOS */}
          <div className="lg:col-span-1 space-y-4">
            {/* Agregar alumno */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700">
              <h3 className="text-base font-black mb-4 uppercase text-white italic">Nuevo Alumno</h3>
              <div className="space-y-3">
                <input 
                  placeholder="Nombre completo" 
                  className="bg-[#2a2a2a] p-3 rounded-xl w-full text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all" 
                  value={nombreAlumno} 
                  onChange={e => setNombreAlumno(e.target.value)} 
                />
                <select 
                  className="bg-[#2a2a2a] p-3 rounded-xl w-full text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all"
                  value={equipoAlumno}
                  onChange={e => setEquipoAlumno(e.target.value)}
                >
                  <option value="">Selecciona área</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.nombre}>{a.nombre}</option>
                  ))}
                </select>
                <button 
                  onClick={agregarAlumno} 
                  disabled={loading}
                  className="w-full bg-orange-500 font-black py-3 rounded-xl text-black hover:bg-orange-400 transition-all disabled:opacity-50 text-sm"
                >
                  AÑADIR
                </button>
              </div>
            </section>

            {/* Listado alumnos */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700 max-h-[450px] overflow-y-auto">
              <h3 className="text-base font-black mb-3 uppercase text-white italic">Alumnos ({alumnos.length})</h3>
              <div className="space-y-2">
                {alumnos.map(a => (
                  <div key={a.id} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-lg border border-gray-800 group hover:border-gray-700 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-100 leading-tight text-sm truncate">{a.nombre_completo}</p>
                      <p className="text-[9px] text-orange-500 font-black uppercase tracking-tighter">{a.equipo}</p>
                    </div>
                    <button 
                      onClick={() => eliminarAlumno(a.id)} 
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all ml-2 flex-shrink-0"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLUMNA 2: GESTIÓN DE ÁREAS */}
          <div className="lg:col-span-1 space-y-4">
            {/* Agregar área */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700">
              <h3 className="text-base font-black mb-4 uppercase text-white italic">Nueva Área</h3>
              <div className="space-y-3">
                <input 
                  placeholder="Nombre del área" 
                  className="bg-[#2a2a2a] p-3 rounded-xl w-full text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all" 
                  value={nombreArea} 
                  onChange={e => setNombreArea(e.target.value)} 
                />
                <button 
                  onClick={agregarArea} 
                  disabled={loading}
                  className="w-full bg-green-600 font-black py-3 rounded-xl text-white hover:bg-green-500 transition-all disabled:opacity-50 text-sm"
                >
                  CREAR ÁREA
                </button>
              </div>
            </section>

            {/* Listado áreas */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700 max-h-[450px] overflow-y-auto">
              <h3 className="text-base font-black mb-3 uppercase text-white italic">Áreas ({areas.length})</h3>
              <div className="space-y-2">
                {areas.map(a => (
                  <div key={a.id} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-lg border border-gray-800 group hover:border-gray-700 transition-all">
                    <p className="font-bold text-gray-100 text-sm">{a.nombre}</p>
                    <button 
                      onClick={() => eliminarArea(a.id)} 
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLUMNA 3-4: GESTIÓN DE FICHAJES */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filtros */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700">
              <h3 className="text-base font-black mb-4 uppercase text-white italic mb-4">Filtros de Fichajes</h3>
              <div className="grid grid-cols-3 gap-3">
                <input 
                  type="text"
                  placeholder="Búscar alumno..." 
                  className="bg-[#2a2a2a] p-3 rounded-xl text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all col-span-1"
                  value={filtroAlumno}
                  onChange={e => setFiltroAlumno(e.target.value)}
                />
                <select 
                  className="bg-[#2a2a2a] p-3 rounded-xl text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all col-span-1"
                  value={filtroArea}
                  onChange={e => setFiltroArea(e.target.value)}
                >
                  <option value="">Todas las áreas</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.nombre}>{a.nombre}</option>
                  ))}
                </select>
                <input 
                  type="date"
                  className="bg-[#2a2a2a] p-3 rounded-xl text-white text-sm border border-transparent focus:border-orange-500 outline-none transition-all col-span-1"
                  value={filtroFecha}
                  onChange={e => setFiltroFecha(e.target.value)}
                />
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Mostrando {fichajeFiltrados.length} de {fichajes.length} fichajes
              </div>
            </section>

            {/* Tabla fichajes */}
            <section className="bg-[#1e1e1e] p-6 rounded-[2rem] border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black uppercase text-white italic">Historial ({fichajeFiltrados.length})</h3>
                <button 
                  onClick={exportarCSV}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black py-2 px-4 rounded-lg transition-all text-sm"
                >
                  📥 Exportar CSV
                </button>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0">
                    <tr className="text-gray-500 text-left uppercase text-[10px] font-black border-b border-gray-800">
                      <th className="pb-4 px-2">Alumno / Área</th>
                      <th className="pb-4 px-2 text-center">Fecha</th>
                      <th className="pb-4 px-2 text-center">Entrada</th>
                      <th className="pb-4 px-2 text-center">Salida</th>
                      <th className="pb-4 px-2 text-right">Estado</th>
                      <th className="pb-4 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {fichajeFiltrados.length > 0 ? (
                      fichajeFiltrados.map(f => (
                        <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-2">
                            <p className="font-bold text-gray-200">{f.nombre}</p>
                            <p className="text-[10px] text-orange-500 uppercase font-black">{f.equipo}</p>
                          </td>
                          <td className="py-4 px-2 text-gray-400 text-center">{f.fecha}</td>
                          
                          {/* Columna Entrada */}
                          <td className="py-4 px-2 text-center">
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-mono font-bold">
                              {f.hora_entrada}
                            </span>
                          </td>

                          {/* Columna Salida */}
                          <td className="py-4 px-2 text-center">
                            {f.hora_salida ? (
                              <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full font-mono font-bold">
                                {f.hora_salida}
                              </span>
                            ) : (
                              <span className="text-gray-600 font-mono italic">--:--</span>
                            )}
                          </td>

                          {/* Columna Estado Visual */}
                          <td className="py-4 px-2 text-right">
                            {f.hora_salida ? (
                              <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded uppercase font-black">
                                Completado
                              </span>
                            ) : f.fecha === new Date().toISOString().split('T')[0] ? (
                              <span className="text-[10px] bg-green-500 text-black px-2 py-1 rounded uppercase font-black animate-pulse">
                                En curso
                              </span>
                            ) : (
                              <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded uppercase font-black">
                                SIN SALIDA (OLVIDO)
                              </span>
                            )}
                          </td>
                          
                          {/* Columna Acciones */}
                          <td className="py-4 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(f)}
                                className="text-orange-500 hover:text-orange-400 font-bold text-sm px-3 py-1 rounded-lg border border-orange-500/30 hover:border-orange-500/50 transition-all"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteFichaje(f.id)}
                                className="text-red-500 hover:text-red-400 font-bold text-sm px-3 py-1 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 px-2 text-center text-gray-500 text-sm">
                          No hay fichajes que coincidan con los filtros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
              {/* Modal de Edición de Fichaje */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e1e1e] rounded-2xl border border-gray-700 w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-white">Editar Fichaje</h3>
                <button 
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                    Nombre del Alumno
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    value={editFormData.nombre}
                    onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                    Área
                  </label>
                  <select
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    value={editFormData.equipo}
                    onChange={(e) => setEditFormData({...editFormData, equipo: e.target.value})}
                    required
                  >
                    <option value="">Selecciona un área</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.nombre}>{area.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    value={editFormData.fecha}
                    onChange={(e) => setEditFormData({...editFormData, fecha: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                      Hora Entrada
                    </label>
                    <input
                      type="time"
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                      value={editFormData.hora_entrada}
                      onChange={(e) => setEditFormData({...editFormData, hora_entrada: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                      Hora Salida
                    </label>
                    <input
                      type="time"
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                      value={editFormData.hora_salida || ''}
                      onChange={(e) => setEditFormData({...editFormData, hora_salida: e.target.value || null})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="absentismo"
                    className="w-4 h-4 text-orange-500 bg-[#2a2a2a] border-gray-600 rounded focus:ring-orange-500"
                    checked={editFormData.absentismo}
                    onChange={(e) => setEditFormData({...editFormData, absentismo: e.target.checked})}
                  />
                  <label htmlFor="absentismo" className="ml-2 text-sm text-gray-300">
                    Marcar como absentismo
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-black py-3 rounded-xl transition-all"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-3 rounded-xl transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
