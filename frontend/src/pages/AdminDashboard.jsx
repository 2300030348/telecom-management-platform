import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users, Layers, CreditCard, DollarSign, Activity, LogOut, 
  Search, Shield, Settings, FileText, Bell, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [realStats, setRealStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    blockedSubscribers: 0,
    totalPlans: 0,
    monthlyRevenue: 45820.00,
    pendingBills: 142
  });
  const [subscribers, setSubscribers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    type: 'PREPAID',
    price: '',
    validityDays: '',
    dataLimitGb: '',
    voiceLimitMinutes: '',
    smsLimit: '',
    speedLimitMbps: '',
    status: 'ACTIVE'
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlanSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/admin/plans', {
        ...newPlan,
        price: newPlan.price ? parseFloat(newPlan.price) : 0,
        validityDays: newPlan.validityDays ? parseInt(newPlan.validityDays) : 30,
        dataLimitGb: newPlan.dataLimitGb ? parseFloat(newPlan.dataLimitGb) : 0,
        voiceLimitMinutes: newPlan.voiceLimitMinutes ? parseInt(newPlan.voiceLimitMinutes) : 0,
        smsLimit: newPlan.smsLimit ? parseInt(newPlan.smsLimit) : 0,
        speedLimitMbps: newPlan.speedLimitMbps ? parseInt(newPlan.speedLimitMbps) : 0
      });
      const plansRes = await api.get('/admin/plans');
      setPlans(plansRes.data);
      setShowAddPlanModal(false);
      setNewPlan({
        name: '',
        type: 'PREPAID',
        price: '',
        validityDays: '',
        dataLimitGb: '',
        voiceLimitMinutes: '',
        smsLimit: '',
        speedLimitMbps: '',
        status: 'ACTIVE'
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to add plan. Ensure all fields are filled.');
    }
  };

  // Fetch real-time data from backend APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subsRes, plansRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/subscribers'),
          api.get('/admin/plans')
        ]);
        setRealStats(statsRes.data);
        setSubscribers(subsRes.data);
        setPlans(plansRes.data);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Refetch when changing tabs to ensure latest data is loaded

  const kpis = [
    { title: "Total Subscribers", value: realStats.totalSubscribers, icon: <Users size={20} color="hsl(var(--secondary))" />, desc: "Registered customers" },
    { title: "Active Subscribers", value: realStats.activeSubscribers, icon: <CheckCircle size={20} color="hsl(var(--success))" />, desc: "Lines active" },
    { title: "Blocked Subscribers", value: realStats.blockedSubscribers, icon: <AlertTriangle size={20} color="hsl(var(--error))" />, desc: "Lines blocked/suspended" },
    { title: "Catalog Plans", value: realStats.totalPlans, icon: <Layers size={20} color="hsl(var(--primary))" />, desc: "Active package offerings" }
  ];

  const auditLogs = [
    { time: "Just Now", user: "System", action: "Fetched real-time subscriber and billing stats" },
    { time: "10:14 AM", user: "Admin", action: "Created new plan: Unlimited Pro" },
    { time: "09:42 AM", user: "Agent_Sarah", action: "Blocked subscriber +1 555-0988 (Overdue)" }
  ];

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex' }}>
      <div className="app-bg-wrapper">
        <div className="bg-orb bg-orb-primary"></div>
        <div className="bg-orb bg-orb-secondary"></div>
      </div>

      {/* Sidebar */}
      <aside className="glass-panel" style={{
        width: sidebarCollapsed ? '80px' : '260px',
        margin: '1rem 0 1rem 1rem',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <Shield size={28} color="hsl(var(--secondary))" />
          {!sidebarCollapsed && <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem', fontWeight: 800 }}>AdminPortal</span>}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}>
            <Activity size={18} />
            {!sidebarCollapsed && 'Overview'}
          </button>
          <button onClick={() => setActiveTab('subscribers')} className={`btn ${activeTab === 'subscribers' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}>
            <Users size={18} />
            {!sidebarCollapsed && 'Subscribers'}
          </button>
          <button onClick={() => setActiveTab('plans')} className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}>
            <Layers size={18} />
            {!sidebarCollapsed && 'Plans'}
          </button>
          <button onClick={() => setActiveTab('billing')} className={`btn ${activeTab === 'billing' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem' }}>
            <CreditCard size={18} />
            {!sidebarCollapsed && 'Billing & Recharges'}
          </button>
        </nav>

        <button onClick={onLogout} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.65rem 1rem', marginTop: 'auto' }}>
          <LogOut size={18} />
          {!sidebarCollapsed && 'Sign Out'}
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 2rem 2rem 2rem', overflowX: 'hidden' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
              Logged in as: <strong>{user.username}</strong>
            </div>
            <div style={{
              background: 'hsla(var(--primary) / 0.1)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: 'hsl(var(--primary))',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              Administrator
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'hsl(var(--text-secondary))' }}>Loading Real-Time Systems Data...</div>
          </div>
        ) : (
          <>
            {/* Content body based on Active Tab */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Control Desk Overview</h2>
                  <p style={{ color: 'hsl(var(--text-secondary))' }}>Platform usage analytics, billing monitoring, and system status logs.</p>
                </div>

                {/* KPI Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {kpis.map((s, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>{s.title}</span>
                        {s.icon}
                      </div>
                      <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{s.value}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{s.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Tables / Logs section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                  
                  {/* Recent Subscribers */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Subscribers (Real-Time)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {subscribers.length > 0 ? (
                        subscribers.slice(-3).reverse().map((sub, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsla(var(--border) / 0.3)', paddingBottom: '0.75rem' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{sub.firstName} {sub.lastName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>{sub.phoneNumber}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{sub.billingType}</div>
                              <span style={{ fontSize: '0.75rem', color: sub.status === 'ACTIVE' ? 'hsl(var(--success))' : 'hsl(var(--error))' }}>{sub.status}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '1rem' }}>No subscribers registered yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Audit Logs */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>System Audit Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {auditLogs.map((log, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap' }}>{log.time}</span>
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{log.user}</strong>
                            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>{log.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Subscriber Directory (Live)</h3>
                <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>Configure subscribers, adjust postpaid limits, or edit statuses.</p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <input className="form-input" placeholder="Search subscribers..." style={{ maxWidth: '300px', padding: '0.5rem 1rem' }} />
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-secondary))' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>Subscriber</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Phone</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Billing Type</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                        <td style={{ padding: '1rem 0.5rem' }}>{sub.firstName} {sub.lastName}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{sub.phoneNumber}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>{sub.billingType}</td>
                        <td style={{ padding: '1rem 0.5rem', color: sub.status === 'ACTIVE' ? 'hsl(var(--success))' : 'hsl(var(--error))' }}>{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Plan Catalog (Live)</h3>
                    <p style={{ color: 'hsl(var(--text-secondary))', margin: 0 }}>Define prepaid vouchers, monthly subscription rates, and speed caps.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddPlanModal(true)} 
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: 600 }}
                  >
                    + Add New Plan
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {plans.map((p, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem', border: p.status === 'ACTIVE' ? '1px solid hsl(var(--primary))' : '1px solid var(--glass-border)' }}>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                        Limit: {p.dataLimitGb} GB Data • {p.voiceLimitMinutes} Min Voice • {p.smsLimit} SMS
                      </p>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${p.price} / {p.validityDays} days</div>
                    </div>
                  ))}
                </div>

                {/* Add Plan Modal Overlay */}
                {showAddPlanModal && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(5, 6, 12, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                  }}>
                    <div className="glass-panel" style={{
                      width: '100%',
                      maxWidth: '550px',
                      padding: '2.5rem',
                      maxHeight: '90vh',
                      overflowY: 'auto'
                    }}>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Telecom Package</h3>
                      <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Publish a new subscriber package to the customer directory.
                      </p>

                      {errorMsg && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: 'hsl(var(--error))',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '1.25rem',
                          fontSize: '0.85rem'
                        }}>{errorMsg}</div>
                      )}

                      <form onSubmit={handleAddPlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">Package Name</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Speedster Ultra 5G"
                            value={newPlan.name}
                            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                            required 
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Billing Type</label>
                            <select 
                              className="form-input"
                              style={{ background: '#0e0f1d', cursor: 'pointer' }}
                              value={newPlan.type}
                              onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                            >
                              <option value="PREPAID">PREPAID</option>
                              <option value="POSTPAID">POSTPAID</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Price (USD)</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              className="form-input" 
                              placeholder="29.99"
                              value={newPlan.price}
                              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                              required 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Validity (Days)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="30"
                              value={newPlan.validityDays}
                              onChange={(e) => setNewPlan({ ...newPlan, validityDays: e.target.value })}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Data Limit (GB)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="50"
                              value={newPlan.dataLimitGb}
                              onChange={(e) => setNewPlan({ ...newPlan, dataLimitGb: e.target.value })}
                              required 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                          <div className="form-group">
                            <label className="form-label">Voice (Min)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="1000"
                              value={newPlan.voiceLimitMinutes}
                              onChange={(e) => setNewPlan({ ...newPlan, voiceLimitMinutes: e.target.value })}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">SMS Limit</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="500"
                              value={newPlan.smsLimit}
                              onChange={(e) => setNewPlan({ ...newPlan, smsLimit: e.target.value })}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Speed (Mbps)</label>
                            <input 
                              type="number" 
                              className="form-input" 
                              placeholder="100"
                              value={newPlan.speedLimitMbps}
                              onChange={(e) => setNewPlan({ ...newPlan, speedLimitMbps: e.target.value })}
                              required 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => setShowAddPlanModal(false)}
                            style={{ padding: '0.6rem 1.2rem' }}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ padding: '0.6rem 1.2rem' }}
                          >
                            Publish Package
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeTab === 'billing' && (
              <div className="animate-fade-in glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Billing Operations</h3>
                <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem' }}>Review payment summaries, generate invoices, or initiate refunds.</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Total Invoiced</div>
                    <h3 style={{ fontSize: '1.5rem' }}>$12,450.00</h3>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Collected Today</div>
                    <h3 style={{ fontSize: '1.5rem', color: 'hsl(var(--success))' }}>$1,240.00</h3>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
