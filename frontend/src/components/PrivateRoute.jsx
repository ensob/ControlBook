import { useAuthStore } from '../context/store'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
