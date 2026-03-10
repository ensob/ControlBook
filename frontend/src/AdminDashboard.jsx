import React, { useState, useEffect } from 'react';
import { useAuthStore } from './context/store';
import { useClassStore } from './context/store';
import { useAttendanceStore } from './context/store';
import { supabase } from './supabase';

const AdminDashboard = () => {
  const { logout, user } = useAuthStore();
  const { classes, fetchClasses } = useClassStore();
  const { attendance, fetchAttendance } = useAttendanceStore();
  const [alumnos, setAlumnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
    fetchAttendance(selectedDate);
    fetchAlumnos();
  }, [selectedDate]);

  const fetchAlumnos = async () => {
    try {
      const { data, error } = await supabase.from('alumnos').select('*');
      if (error) throw error;
      setAlumnos(data);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Navigate to login or home
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="mr-4">Bienvenido, {user?.email}</span>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sección de Alumnos */}
        <div className="bg-[#1e1e1e] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Alumnos</h2>
          <ul>
            {alumnos.map((alumno) => (
              <li key={alumno.id} className="mb-2">{alumno.nombre_completo || alumno.nombre}</li>
            ))}
          </ul>
          {/* Agregar botones para agregar/editar/eliminar alumnos */}
        </div>

        {/* Sección de Fichajes */}
        <div className="bg-[#1e1e1e] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Fichajes</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mb-4 p-2 bg-[#2a2a2a] text-white rounded"
          />
          <ul>
            {attendance.map((fichaje) => (
              <li key={fichaje.id} className="mb-2">
                {fichaje.nombre} - {fichaje.hora_entrada} ({fichaje.fecha})
              </li>
            ))}
          </ul>
          {/* Agregar filtros o gestión de fichajes */}
        </div>

        {/* Sección de Equipos (Áreas) */}
        <div className="bg-[#1e1e1e] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Equipos / Áreas</h2>
          <ul>
            {classes.map((equipo) => (
              <li key={equipo.id} className="mb-2">{equipo.nombre}</li>
            ))}
          </ul>
          {/* Agregar botones para gestionar equipos */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;