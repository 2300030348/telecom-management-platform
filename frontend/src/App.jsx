import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // 'login' | 'register' | 'dashboard'

  // Retrieve existing user credentials on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('aeronet_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setPage('dashboard');
      } catch (e) {
        localStorage.removeItem('aeronet_user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('aeronet_user', JSON.stringify(userData));
    setPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    // Redirect to login page after registering successfully
    setPage('login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aeronet_user');
    setPage('login');
  };

  // Role-based client-side routing
  if (page === 'dashboard' && user) {
    const roles = user.roles || [];
    if (roles.includes('ROLE_ADMIN')) {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else if (roles.includes('ROLE_SUPPORT')) {
      return <AgentDashboard user={user} onLogout={handleLogout} />;
    } else {
      return <CustomerDashboard user={user} onLogout={handleLogout} />;
    }
  }

  if (page === 'register') {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        navigateToLogin={() => setPage('login')}
      />
    );
  }

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      navigateToRegister={() => setPage('register')}
    />
  );
}

export default App;
