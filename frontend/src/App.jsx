import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './context/store'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsManagementPage from './pages/StudentsManagementPage'
import ClassesPage from './pages/ClassesPage'
import StudentPage from './pages/StudentPage'
import AttendancePage from './pages/AttendancePage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

// Components
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

export default function App() {
  const { isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    // Verificar token al cargar
    if (token) {
      // Aquí se puede validar el token en el backend
    }
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <DashboardPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/alumnos"
          element={
            isAuthenticated ? (
              <Layout>
                <StudentsManagementPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/classes"
          element={
            isAuthenticated ? (
              <Layout>
                <ClassesPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/classes/:classId/students"
          element={
            isAuthenticated ? (
              <Layout>
                <StudentPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/classes/:classId/attendance"
          element={
            isAuthenticated ? (
              <Layout>
                <AttendancePage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <Layout>
                <ReportsPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Layout>
                <SettingsPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
