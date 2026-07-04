import React from 'react';
import { LogOut, User, Shield, CreditCard, Activity, Wifi, ShieldAlert } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  // Mock data for premium design showcase
  const metrics = [
    { title: "Current Balance", value: "$45.80", icon: <CreditCard size={20} color="hsl(var(--secondary))" />, desc: "Due on July 20, 2026" },
    { title: "Active Plan", value: "Unlimited Cyber 5G", icon: <Wifi size={20} color="hsl(var(--primary))" />, desc: "50GB Hotspot included" },
    { title: "Data Usage", value: "14.2 GB / 100 GB", icon: <Activity size={20} color="hsl(var(--accent))" />, desc: "Resets in 17 days" }
  ];

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-bg-wrapper">
        <div className="bg-orb bg-orb-primary"></div>
        <div className="bg-orb bg-orb-secondary"></div>
        <div className="bg-orb bg-orb-accent"></div>
      </div>

      {/* Navigation Header */}
      <header className="glass-panel" style={{
        margin: '1.5rem',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={28} color="hsl(var(--secondary))" />
          <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800 }}>AeroNet</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
              padding: '0.5rem',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.username}</div>
              <div style={{
                fontSize: '0.75rem',
                color: 'hsl(var(--secondary))',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                {user.roles && user.roles.length > 0 ? user.roles[0].replace('ROLE_', '') : 'CUSTOMER'}
              </div>
            </div>
          </div>

          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '0 2rem 3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back, {user.username}!</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>AeroNet Telecom Portal — Control Desk and Service Management Dashboard.</p>
        </div>

        {/* Info Banner */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          borderLeft: '4px solid hsl(var(--primary))',
          background: 'linear-gradient(90deg, rgba(138, 75, 243, 0.1) 0%, transparent 100%)'
        }}>
          <Shield size={32} color="hsl(var(--primary))" />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Enterprise Security Activated</h4>
            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
              Your session is secured using stateless JSON Web Token (JWT) credentials. Roles associated with your access: <strong>{user.roles ? user.roles.join(', ') : 'None'}</strong>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {metrics.map((m, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '2rem', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))', fontWeight: 500, fontSize: '0.95rem' }}>{m.title}</span>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {m.icon}
                </div>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-family-display)' }}>{m.value}</h3>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Core Modules</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem', maxWidth: '600px' }}>
            AeroNet Enterprise management suite offers plan administration, automated usage calculation, service blocking, and real-time billing audits.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Manage Plan</button>
            <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Billing History</button>
            <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Usage Details</button>
          </div>
        </div>
      </main>
    </div>
  );
}
