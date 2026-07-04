import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Wifi, CreditCard, Activity, LogOut, ArrowRight, Shield, 
  HelpCircle, MessageSquare, Plus, Bell, RefreshCw, Layers, Calendar
} from 'lucide-react';

export default function CustomerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [tickets, setTickets] = useState([
    { id: "T-8941", subject: "Slow speed in my area", status: "In Progress", date: "July 2, 2026" }
  ]);

  // Live states
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [bills, setBills] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Recharge form state
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const fetchCustomerData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, subRes, billsRes, plansRes] = await Promise.all([
        api.get('/customer/profile'),
        api.get('/customer/subscription'),
        api.get('/customer/bills'),
        api.get('/customer/plans')
      ]);
      setProfile(profileRes.data);
      setSubscription(subRes.data.active !== false ? subRes.data : null);
      setBills(billsRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      console.error("Error loading customer details:", err);
      setError("Failed to fetch account info from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [activeTab]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) {
      setError("Please select a telecom package first.");
      return;
    }

    const plan = plans.find(p => p.id === parseInt(selectedPlanId));
    if (!plan) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/customer/recharge', {
        planId: plan.id,
        amount: plan.price,
        paymentMethod: paymentMethod
      });
      setSuccess(response.data.message);
      setSelectedPlanId('');
      // Refetch
      await fetchCustomerData();
    } catch (err) {
      console.error("Recharge request failed:", err);
      setError(err.response?.data?.message || "Recharge failed. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;
    const newTicket = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: supportSubject,
      status: "Open",
      date: "Today"
    };
    setTickets([newTicket, ...tickets]);
    setSupportSubject('');
    setSupportMessage('');
    alert("Support ticket raised successfully!");
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-bg-wrapper">
        <div className="bg-orb bg-orb-primary"></div>
        <div className="bg-orb bg-orb-accent"></div>
      </div>

      {/* Header */}
      <header className="glass-panel" style={{
        margin: '1.5rem',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Wifi size={28} color="hsl(var(--secondary))" />
          <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800 }}>AeroNet subscriber</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.username}</div>
            <span style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--secondary))',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              Customer
            </span>
          </div>

          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Feedback Alerts */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'hsl(var(--error))',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: 'hsl(var(--success))',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>{success}</div>
        )}
      </div>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '1rem', padding: '0 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1.25rem' }}>Dashboard</button>
        <button onClick={() => setActiveTab('recharge')} className={`btn ${activeTab === 'recharge' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1.25rem' }}>Recharge Portal</button>
        <button onClick={() => setActiveTab('support')} className={`btn ${activeTab === 'support' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.5rem 1.25rem' }}>Support & Help</button>
      </div>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '0 2rem 3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {loading && !profile ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--text-muted))' }}>Loading subscriber profile...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && profile && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Top metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ color: 'hsl(var(--text-secondary))' }}>
                        {profile.billingType === 'POSTPAID' ? 'Amount Due (Postpaid)' : 'Account Balance (Prepaid)'}
                      </span>
                      <CreditCard size={20} color="hsl(var(--secondary))" />
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-family-display)' }}>
                      ${profile.balance != null ? profile.balance.toFixed(2) : '0.00'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem' }}>
                      Status: <span style={{ color: profile.status === 'ACTIVE' ? 'hsl(var(--success))' : 'hsl(var(--error))', fontWeight: 600 }}>{profile.status}</span>
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ color: 'hsl(var(--text-secondary))' }}>High-Speed Data Allowance</span>
                      <Wifi size={20} color="hsl(var(--primary))" />
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-family-display)' }}>
                      {subscription ? `${subscription.plan.dataLimitGb} GB` : '0 GB'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem' }}>
                      Plan: {subscription ? subscription.plan.name : 'No Active Plan'}
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ color: 'hsl(var(--text-secondary))' }}>Voice & SMS Allowance</span>
                      <Activity size={20} color="hsl(var(--accent))" />
                    </div>
                    <h3 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-family-display)' }}>
                      {subscription ? `${subscription.plan.voiceLimitMinutes} Min` : '0 Min'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.5rem' }}>
                      SMS: {subscription ? subscription.plan.smsLimit : '0'} / Speed: {subscription ? `${subscription.plan.speedLimitMbps} Mbps` : '0'}
                    </p>
                  </div>
                </div>

                {/* Plan Card */}
                <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                  <div>
                    <span style={{ color: 'hsl(var(--secondary))', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Active Plan Details</span>
                    <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>
                      {subscription ? subscription.plan.name : 'Voucher Required'}
                    </h3>
                    {subscription ? (
                      <p style={{ color: 'hsl(var(--text-secondary))' }}>
                        Validity End Date: <strong>{new Date(subscription.endDate).toLocaleDateString()}</strong> (Auto-renewal enabled).
                      </p>
                    ) : (
                      <p style={{ color: 'hsl(var(--text-secondary))' }}>
                        Your line is currently inactive. Please go to the Recharge Portal to activate your plan.
                      </p>
                    )}
                  </div>
                  <button className="btn btn-primary" onClick={() => setActiveTab('recharge')}>
                    {subscription ? 'Upgrade Plan' : 'Buy Plan'} <ArrowRight size={16} />
                  </button>
                </div>

                {/* Bills Table */}
                {profile.billingType === 'POSTPAID' && (
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Postpaid Invoice History</h3>
                    {bills.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-secondary))' }}>
                            <th style={{ padding: '0.75rem' }}>Billing Period</th>
                            <th style={{ padding: '0.75rem' }}>Amount Due</th>
                            <th style={{ padding: '0.75rem' }}>Tax</th>
                            <th style={{ padding: '0.75rem' }}>Due Date</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bills.map((bill, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                              <td style={{ padding: '0.75rem' }}>
                                {new Date(bill.billPeriodStart).toLocaleDateString()} - {new Date(bill.billPeriodEnd).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '0.75rem' }}>${bill.amountDue.toFixed(2)}</td>
                              <td style={{ padding: '0.75rem' }}>${bill.taxAmount != null ? bill.taxAmount.toFixed(2) : '0.00'}</td>
                              <td style={{ padding: '0.75rem' }}>{new Date(bill.dueDate).toLocaleDateString()}</td>
                              <td style={{ padding: '0.75rem', color: bill.status === 'PAID' ? 'hsl(var(--success))' : 'hsl(var(--error))', fontWeight: 600 }}>
                                {bill.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '1rem' }}>No bills generated yet for this period.</div>
                    )}
                  </div>
                )}

              </div>
            )}

            {activeTab === 'recharge' && (
              <div className="animate-fade-in glass-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Prepaid & Postpaid Recharge Desk</h3>
                <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2.5rem' }}>Select a telecom package from the catalog to activate your phone line.</p>

                {plans.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {plans.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="glass-panel" 
                        style={{ 
                          padding: '1.5rem', 
                          cursor: 'pointer', 
                          border: selectedPlanId === p.id ? '2px solid hsl(var(--primary))' : '1px solid var(--glass-border)',
                          transition: 'all 0.2s ease',
                          transform: selectedPlanId === p.id ? 'scale(1.02)' : 'none'
                        }} 
                        onClick={() => setSelectedPlanId(p.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{p.name}</h4>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: p.type === 'PREPAID' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: p.type === 'PREPAID' ? '#60a5fa' : '#34d399',
                            fontWeight: 600
                          }}>{p.type}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                          {p.dataLimitGb} GB Data • {p.voiceLimitMinutes} Min Voice • {p.smsLimit} SMS • {p.speedLimitMbps} Mbps
                        </p>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${p.price} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'hsl(var(--text-muted))' }}>/ {p.validityDays} days</span></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '2rem' }}>No packages published in the catalog yet.</div>
                )}

                <form onSubmit={handleRecharge} style={{ maxWidth: '450px' }}>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Select Payment Method</label>
                    <select 
                      className="form-input" 
                      style={{ background: '#0e0f1d', cursor: 'pointer' }}
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                    >
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="UPI">UPI (Google Pay / PhonePe)</option>
                      <option value="NET_BANKING">Net Banking</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !selectedPlanId}>
                    {loading ? 'Processing secure payment...' : 'Confirm Recharge & Pay'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
                
                {/* Raise Ticket */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Raise a Support Ticket</h3>
                  <form onSubmit={handleSupportSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="subject">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        className="form-input"
                        placeholder="Briefly state your concern"
                        style={{ paddingLeft: '1rem' }}
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="msg">Details / Message</label>
                      <textarea
                        id="msg"
                        className="form-input"
                        placeholder="Describe the issue in detail"
                        style={{ paddingLeft: '1rem', minHeight: '120px', resize: 'vertical' }}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Ticket</button>
                  </form>
                </div>

                {/* Support History */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Support Requests</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tickets.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsla(var(--border) / 0.3)', paddingBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{t.subject}</div>
                          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>ID: {t.id} • Raised {t.date}</span>
                        </div>
                        <div>
                          <span style={{
                            background: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            color: 'rgb(234, 179, 8)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
