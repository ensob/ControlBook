import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Layout({ children }) {
  const { logout, user } = useAuthStore()
  const location = useLocation()
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="gradient-orange sticky top-0 z-50 shadow-lg">
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
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-white hover:bg-orange-500'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-sm font-semibold text-white">{user?.name || 'Tutor'}</p>
              <p className="text-xs text-orange-100">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="px-4 py-2 rounded-lg bg-white text-primary-600 font-semibold hover:bg-orange-100 transition-colors"
            >
              Salir
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-primary-600 border-t-2 border-primary-700"
          >
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(item.path)
                      ? 'bg-white text-primary-600'
                      : 'text-white hover:bg-primary-700'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2026 ControlBook - Sistema de Control de Asistencia 🎓 | 
            Diseñado para educadores modernos
          </p>
        </div>
      </footer>
    </div>
  )
}
