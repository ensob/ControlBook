import { useAuthStore } from '../context/store'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
