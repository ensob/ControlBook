import { useState } from 'react'

function App() {
  const [loading, setLoading] = useState(false);

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
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nombre Completo</label>
            <input 
              type="text" 
              className="w-full bg-urban-asfalto border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-urban-naranja transition-all placeholder:text-gray-700" 
              placeholder="Ej. Alex Smith"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label className="block text-xs font-bold text-gray-400 uppercase -mb-2 ml-1">Equipo / Área</label>
            <div className="flex gap-2">
              {['Producción', 'Realización', 'DJ'].map((item) => (
                <button 
                  key={item}
                  type="button"
                  className="flex-1 py-3 rounded-xl border-2 border-white/5 bg-urban-asfalto text-[10px] font-black uppercase hover:border-urban-naranja hover:text-urban-naranja transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-urban-asfalto p-4 rounded-2xl border border-white/5">
            <span className="text-sm font-bold">¿Reportar Absentismo?</span>
            <input type="checkbox" className="w-6 h-6 accent-urban-naranja" />
          </div>

          <button 
            className="w-full bg-urban-naranja hover:bg-urban-naranjaHover text-black font-black py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,95,31,0.2)]"
            disabled={loading}
          >
            {loading ? 'PROCESANDO...' : 'FICHAR AHORA'}
          </button>
        </form>
      </div>

      <footer className="mt-12 text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest">
        &copy; 2026 Controlbook Urban Tech for Xielti by Yoocit
      </footer>
    </div>
  )
}

export default App

