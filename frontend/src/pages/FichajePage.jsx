import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FichajePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-urban-asfalto text-white p-4 md:p-8 font-sans">
      {/* Header Estilo Street */}
      <header className="max-w-md mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter">
          CONTROL<span className="text-urban-naranja underline decoration-2 underline-offset-4">BOOK</span>
        </h1>
        <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Dance Studio Management</p>
      </header>

      {/* Formulario Principal */}
      <div className="max-w-md mx-auto bg-urban-grisCard p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <form className="space-y-6">
          {/* ... (aquí va tu formulario tal cual lo tenías) ... */}
          <button className="w-full bg-urban-naranja hover:bg-urban-naranjaHover text-black font-black py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,95,31,0.2)]">
            {loading ? 'PROCESANDO...' : 'FICHAR AHORA'}
          </button>
        </form>
      </div>

      {/* FOOTER CON EL ENLACE AL LOGIN */}
      <footer className="mt-12 text-center">
        <button 
          onClick={() => navigate('/admin')}
          className="text-gray-600 hover:text-urban-naranja text-[10px] uppercase font-bold tracking-widest transition-colors"
        >
          Zona de Gestión Administrativa
        </button>
      </footer>
    </div>
  );
}
