import React, { useState } from 'react';
import api from '../api';
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess, navigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Connect to Spring Boot backend login endpoint
      const response = await api.post('auth/signin', {
        username,
        password,
      });

      setSuccess('Access granted! Authenticating...');
      setTimeout(() => {
        onLoginSuccess(response.data);
      }, 1000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Connection error. Is the server running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="app-bg-wrapper">
        <div className="bg-orb bg-orb-primary"></div>
        <div className="bg-orb bg-orb-secondary"></div>
        <div className="bg-orb bg-orb-accent"></div>
      </div>

      <div className="auth-card glass-panel glass-panel-glow animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={36} color="hsl(var(--secondary))" />
            <span>AeroNet</span>
          </div>
          <p className="auth-subtitle">Enterprise Telecom Management System</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'hsl(var(--error))',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: 'hsl(var(--success))',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-container">
              <User className="input-icon" size={18} />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--text-muted))',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Securing Connection...' : 'Access Portal'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigateToRegister(); }}>
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
