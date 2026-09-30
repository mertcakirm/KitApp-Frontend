import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import { getCookie } from './utils/cookie'; // Cookie kontrolü için

const PublicRoute = ({ children }) => {
  const token = getCookie('token');
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="w-full">
        <Routes>
          <Route path="/"   element={<Home />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
