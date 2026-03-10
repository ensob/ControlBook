import { Link, useLocation, useNavigate } from 'react-router-dom' // Añadido useNavigate
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'
import { useState } from 'react'
import PropTypes from 'prop-types'

export default function Layout({ children }) {
  const { logout, user } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate() // Definido el hook
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/alumnos', label: 'Alumnos', icon: '👨‍🎓' },
    { path: '/classes', label: 'Áreas', icon: '📚' },
    { path: '/reports', label: 'Reportes', icon: '📈' },
    { path: '/settings', label: 'Config', icon: '⚙️' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-600 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl font-black text-white">📖</div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">ControlBook</h1>
              <p className="text-xs text-orange-100">Control de Asistencia</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-white hover:bg-orange-500'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                logout()
                navigate('/admin') // Redirige al login de admin
              }}
              className="px-4 py-2 rounded-lg bg-white text-orange-600 font-semibold hover:bg-orange-100 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center pb-8">
        <button 
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-orange-600 text-[10px] uppercase tracking-widest transition-colors font-bold"
        >
          Acceso Gestión Administrativa
        </button>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

