import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FichajePage from './pages/FichajePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './AdminDashboard'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FichajePage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
