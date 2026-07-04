import React, { useState } from 'react';
import { 
  ShieldAlert, LogOut, Search, User, CreditCard, Layers, 
  HelpCircle, CheckCircle2, MessageSquare, AlertCircle, RefreshCw 
} from 'lucide-react';

export default function AgentDashboard({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [tickets, setTickets] = useState([
    { id: "T-8941", customer: "John Doe", phone: "+1 555-0199", issue: "High packet drop rates on 5G", priority: "High", status: "Open" },
    { id: "T-1043", customer: "Jane Smith", phone: "+1 555-0288", issue: "Billing discrepancy on June statement", priority: "Medium", status: "Open" }
  ]);

  const mockSubscribers = [
    { name: "Prasad", phone: "+1 555-1043", balance: "$45.80", plan: "Unlimited Cyber 5G", type: "Postpaid", status: "Active" },
    { name: "Hema Vardhan", phone: "+1 555-8941", balance: "$0.00", plan: "Student Super", type: "Prepaid", status: "Active" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const found = mockSubscribers.find(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.phone.includes(searchQuery)
    );
    if (found) {
      setSelectedSubscriber(found);
    } else {
      alert("No subscriber found matching that name or phone number.");
      setSelectedSubscriber(null);
    }
  };

  const handleResolveTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
    alert(`Ticket ${id} marked as resolved!`);
  };

  const handleResetPassword = () => {
    if (!selectedSubscriber) return;
    alert(`Generated temporary password reset token for ${selectedSubscriber.name}. Sent via SMS.`);
  };

  const handlePlanAssistance = () => {
    if (!selectedSubscriber) return;
    alert(`Assigned plan change request for ${selectedSubscriber.name} has been queued!`);
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-bg-wrapper">
        <div className="bg-orb bg-orb-primary"></div>
        <div className="bg-orb bg-orb-secondary"></div>
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
          <ShieldAlert size={28} color="hsl(var(--secondary))" />
          <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 800 }}>AeroNet support</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.username}</div>
            <span style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--accent))',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              Support Agent
            </span>
          </div>

          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ flex: 1, padding: '0 2rem 3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Statistics Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>Open Tickets</span>
              <h3 style={{ fontSize: '1.75rem' }}>{tickets.length}</h3>
            </div>
            <AlertCircle size={28} color="hsl(var(--error))" />
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>Resolved Today</span>
              <h3 style={{ fontSize: '1.75rem' }}>14</h3>
            </div>
            <CheckCircle2 size={28} color="hsl(var(--success))" />
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem' }}>Pending Plan Changes</span>
              <h3 style={{ fontSize: '1.75rem' }}>3</h3>
            </div>
            <Layers size={28} color="hsl(var(--primary))" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
          
          {/* Left panel - Subscriber lookup */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Subscriber Lookup</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>Search for subscriber profile details and manage active line locks.</p>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter name (e.g. Prasad) or phone"
                style={{ paddingLeft: '1rem', flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                <Search size={18} />
              </button>
            </form>

            {/* Selected Subscriber Details */}
            {selectedSubscriber ? (
              <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)' }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="hsl(var(--secondary))" />
                  {selectedSubscriber.name}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <div><strong>Phone:</strong> {selectedSubscriber.phone}</div>
                  <div><strong>Billing:</strong> {selectedSubscriber.type}</div>
                  <div><strong>Balance:</strong> {selectedSubscriber.balance}</div>
                  <div><strong>Plan:</strong> {selectedSubscriber.plan}</div>
                  <div><strong>Status:</strong> <span style={{ color: 'hsl(var(--success))' }}>{selectedSubscriber.status}</span></div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleResetPassword}>Reset Pass</button>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handlePlanAssistance}>Assist Plan</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'hsl(var(--text-muted))' }}>
                Search and select a subscriber to load actions.
              </div>
            )}
          </div>

          {/* Right panel - Tickets Queue */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Open Ticket Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {tickets.length > 0 ? (
                tickets.map((t, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid hsla(var(--border) / 0.3)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{t.customer} ({t.phone})</span>
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'hsl(var(--error))',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>{t.priority}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>{t.issue}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>ID: {t.id}</span>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleResolveTicket(t.id)}>Resolve</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(var(--success))', fontWeight: 600 }}>
                  🎉 All tickets successfully resolved!
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
