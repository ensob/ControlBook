import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FichajePage from './pages/FichajePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FichajePage />} />
        <Route path="/admin" element={<LoginPage />} />
        {/* En el futuro: <Route path="/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
