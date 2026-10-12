import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Phone,
  User,
  DollarSign,
  ArrowRight,
  Flame,
  Droplet,
  Zap,
  Shield,
  Layers,
  Key,
  Calendar
} from 'lucide-react';

export function MaintenanceScreen({
  workOrders,
  onUpdateWorkOrderStatus,
  onOpenCreateModal,
  searchTerm = ''
}) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredOrders = workOrders.filter(w => {
    const matchesSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || w.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const columns = [
    { id: 'Reported', label: 'Reported', color: 'var(--status-pending)' },
    { id: 'In Progress', label: 'In Progress', color: 'var(--status-in-progress)' },
    { id: 'Urgent', label: 'Urgent', color: 'var(--status-error)' },
    { id: 'Completed', label: 'Resolved', color: 'var(--status-online)' }
  ];

  const getTicketsForColumn = (colId) => {
    if (colId === 'Urgent') {
      return filteredOrders.filter(w => (w.priority === 'Urgent' || w.priority === 'High') && w.status !== 'Completed');
    }
    return filteredOrders.filter(w => w.status === colId && (colId === 'Completed' || (w.priority !== 'Urgent' && w.priority !== 'High')));
  };

  const categories = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'HVAC', label: 'HVAC', icon: Flame },
    { id: 'Plumbing', label: 'Plumbing', icon: Droplet },
    { id: 'Electrical', label: 'Electric', icon: Zap },
    { id: 'Appliance', label: 'Appliance', icon: Wrench },
    { id: 'Security', label: 'Access', icon: Shield }
  ];

  const getCategoryIcon = (cat) => {
    if (cat.includes('HVAC')) return <Flame size={13} color="var(--cyan-blue)" />;
    if (cat.includes('Plumb')) return <Droplet size={13} color="var(--electric-blue)" />;
    if (cat.includes('Elect')) return <Zap size={13} color="var(--warning)" />;
    if (cat.includes('Security')) return <Shield size={13} color="var(--status-online)" />;
    return <Wrench size={13} color="var(--slate-gray)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Wrench size={22} color="var(--status-pending)" />
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Maintenance Kanban</h1>
            <span className="badge badge-warning">{workOrders.length} Tickets</span>
          </div>

          <button onClick={() => onOpenCreateModal()} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Ticket</span>
          </button>
        </div>

        {/* Category Pills with Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: `1px solid ${categoryFilter === cat.id ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                  background: categoryFilter === cat.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--input-bg-theme)',
                  color: categoryFilter === cat.id ? 'var(--electric-blue)' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        {columns.map(col => {
          const ticketsInCol = getTicketsForColumn(col.id);

          return (
            <div
              key={col.id}
              style={{
                background: 'var(--bg-sidebar)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-card)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                minHeight: '440px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <h3 style={{ fontSize: '0.95rem' }}>{col.label}</h3>
                </div>
                <span style={{
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--input-bg-theme)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: col.color,
                  border: '1px solid var(--border-subtle)'
                }}>
                  {ticketsInCol.length}
                </span>
              </div>

              {/* Tickets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ticketsInCol.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      background: 'var(--input-bg-theme)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--electric-blue)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--cyan-blue)', fontWeight: 700 }}>
                        {ticket.id}
                      </span>
                      <span className={`badge ${
                        ticket.priority === 'Urgent' ? 'badge-urgent' :
                        ticket.priority === 'High' ? 'badge-warning' : 'badge-neutral'
                      }`} style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                        {ticket.priority}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                      {ticket.title}
                    </div>

                    {/* Meta info chips */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getCategoryIcon(ticket.category)} Unit #{ticket.unit}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--cyan-blue)' }}>
                        {ticket.estimatedCost}
                      </span>
                    </div>

                    {/* Tech & Advance action */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-dim)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <User size={11} color="var(--electric-blue)" /> {ticket.assignedTo.split('(')[0]}
                      </span>

                      {ticket.status !== 'Completed' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = ticket.status === 'Reported' ? 'In Progress' : 'Completed';
                            onUpdateWorkOrderStatus(ticket.id, next);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                        >
                          <ArrowRight size={11} />
                        </button>
                      ) : (
                        <span style={{ color: 'var(--status-online)' }}><CheckCircle2 size={13} /></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit' }}>{selectedTicket.id}</span>
                <span className="badge badge-cyan">Unit #{selectedTicket.unit}</span>
                <span className="badge badge-urgent">{selectedTicket.priority}</span>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="btn-icon">×</button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{selectedTicket.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedTicket.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> Tech
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginTop: '2px' }}>{selectedTicket.assignedTo}</div>
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={12} /> Estimate
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--electric-blue)', fontFamily: 'Outfit' }}>{selectedTicket.estimatedCost}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => {
                  onUpdateWorkOrderStatus(selectedTicket.id, 'Completed');
                  setSelectedTicket(null);
                }}
                className="btn btn-primary btn-sm"
              >
                <CheckCircle2 size={13} />
                <span>Mark Resolved</span>
              </button>
              <button onClick={() => setSelectedTicket(null)} className="btn btn-secondary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
