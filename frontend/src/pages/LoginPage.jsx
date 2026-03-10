import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@controlbook.es')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(email, password)
    setIsLoading(false)

    if (success) {
      navigate('/')
    } else {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-accent-orange flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card bg-white/95 backdrop-blur-sm border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-6xl mb-4"
            >
              📖
            </motion.div>
            <h1 className="text-4xl font-black gradient-orange bg-clip-text text-transparent">
              ControlBook v1.0
            </h1>
            <p className="text-gray-600 mt-2">Sistema de Control de Asistencia</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔑 Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Cargando...' : '🚀 Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-3">📝 Demo Credenciales:</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-xs">
              <p><strong>Email:</strong> admin@controlbook.es</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-700">✨ Características:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✅ Gestión de múltiples clases</li>
              <li>✅ Control de asistencia en tiempo real</li>
              <li>✅ Subida de justificantes</li>
              <li>✅ Reportes y estadísticas</li>
              <li>✅ Responsive en todos los dispositivos</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
