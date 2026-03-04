import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './pages/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard'; 
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/me" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute><Applications /></ProtectedRoute>
        } />
        <Route path="/applications/new" element={
          <ProtectedRoute><ApplicationForm /></ProtectedRoute>
        } />
        <Route path="/applications/:id" element={
          <ProtectedRoute><ApplicationForm /></ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App
