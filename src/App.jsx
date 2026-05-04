import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ClassroomWorkspace from './pages/ClassroomWorkspace'; 
import CpuSimulator from './pages/CpuSimulator';
import LecturerDashboard from './pages/LecturerDashboard'; // Impor rute baru

function Layout() {
  const location = useLocation();
  // Sembunyikan Navbar utama di dalam aplikasi
  const hideNavbarRoutes = ['/workspace', '/cpu-simulator', '/lecturer-dashboard']; 
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rute Mahasiswa */}
          <Route path="/workspace" element={<ClassroomWorkspace />} />
          <Route path="/cpu-simulator" element={<CpuSimulator />} />
          
          {/* Rute Dosen */}
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />

          {/* Redirect fallback */}
          <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}