import { useState } from 'react'
import { useAuthStore } from '../context/store'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailReports: true,
    twoFactor: false
  })

  const handleSave = () => {
    localStorage.setItem('controlbook-settings', JSON.stringify(settings))
    alert('✅ Configuración guardada')
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-gray-900">⚙️ Configuración</h1>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">👤 Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <p className="text-lg text-gray-900">{user?.name || 'Tutor'}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
            <p className="text-lg text-gray-900">👨‍🏫 Tutor/Admin</p>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">🎨 Preferencias</h2>
        <div className="space-y-4">
          {[
            { key: 'notifications', label: '🔔 Notificaciones', desc: 'Recibir alertas de asistencia' },
            { key: 'emailReports', label: '📧 Reportes por Email', desc: 'Recibir informes semanales' },
            { key: 'twoFactor', label: '🔐 Autenticación de 2 Factores', desc: 'Mayor seguridad' }
          ].map(pref => (
            <label key={pref.key} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={settings[pref.key]}
                onChange={(e) => setSettings({ ...settings, [pref.key]: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300"
              />
              <div>
                <p className="font-semibold text-gray-900">{pref.label}</p>
                <p className="text-xs text-gray-600">{pref.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleSave}
          className="btn-primary text-lg flex-1 md:flex-initial"
        >
          💾 Guardar Cambios
        </button>
        <button
          onClick={() => {
            logout()
            window.location.href = '/login'
          }}
          className="px-6 py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex-1 md:flex-initial"
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card bg-gradient-to-r from-primary-50 to-orange-50"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">ℹ️ Información</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Versión:</strong> 1.0.0</p>
          <p><strong>Plataforma:</strong> ControlBook 2026</p>
          <p><strong>Soporte:</strong> support@controlbook.es</p>
          <p><strong>Documentación:</strong> <a href="#" className="text-primary-600 hover:underline">docs.controlbook.es</a></p>
        </div>
      </motion.div>
    </div>
  )
}
