import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Writers from './pages/Writers';
import AdminPanel from './pages/AdminPanel';
import WriterPanel from './pages/WriterPanel';
import WriterDetail from './pages/WriterDetail';
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
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={<Writers />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/author-panel" element={<WriterPanel />} />
          <Route path="/author-detail/:id" element={<WriterDetail />} />

          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
