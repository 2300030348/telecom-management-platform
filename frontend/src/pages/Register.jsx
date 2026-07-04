import React, { useState } from 'react';
import api from '../api';
import { Mail, User, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

export default function Register({ onRegisterSuccess, navigateToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Connect to Spring Boot backend register endpoint
      const response = await api.post('auth/signup', {
        username,
        email,
        password,
        role: [role],
      });

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to register. Is the backend server running?');
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
          <p className="auth-subtitle">Create your Enterprise Account</p>
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
                placeholder="Pick a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                minLength={3}
                maxLength={20}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Role Type</label>
            <select
              id="role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: '1rem', background: '#0e0f1d', cursor: 'pointer' }}
            >
              <option value="customer">Customer (Access Dashboard & Plans)</option>
              <option value="admin">Administrator (Manage Telecom System)</option>
              <option value="support">Customer Support Agent</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
            {!loading && <UserPlus size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigateToLogin(); }}>
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
}
