import React, { useState } from 'react';
import {
  Users2,
  Mail,
  Phone,
  Car,
  Dog,
  Shield,
  CreditCard,
  Send,
  Calendar,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  Key,
  DollarSign
} from 'lucide-react';

export function TenantsScreen({ tenants, onOpenNewTenant, onSendNotice, searchTerm = '' }) {
  const [filterType, setFilterType] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);

  const filteredTenants = tenants.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'renewal') return t.status.toLowerCase().includes('renewal') || t.status.toLowerCase().includes('notice');
    if (filterType === 'autopay') return t.autoPay;
    if (filterType === 'balance') return t.balance > 0;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users2 size={22} color="var(--cyan-blue)" />
            <h1 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Residents & Leases</h1>
            <span className="badge badge-cyan">{tenants.length} Active</span>
          </div>

          <button onClick={onOpenNewTenant} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Add Resident</span>
          </button>
        </div>

        {/* Filter Pills with Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          {[
            { id: 'all', label: `All (${tenants.length})`, icon: Users2 },
            { id: 'renewal', label: 'Renewals / Notices', icon: Calendar },
            { id: 'autopay', label: 'AutoPay Active', icon: CreditCard },
            { id: 'balance', label: 'Overdue Balance', icon: AlertCircle }
          ].map(pill => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.id}
                onClick={() => setFilterType(pill.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: `1px solid ${filterType === pill.id ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                  background: filterType === pill.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--input-bg-theme)',
                  color: filterType === pill.id ? 'var(--electric-blue)' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={13} />
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tenants Grid - Crisp & Icon Rich */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem'
      }}>
        {filteredTenants.map(tenant => {
          let statusBadge = <span className="badge badge-online">Active</span>;
          if (tenant.status === 'Renewal Pending') statusBadge = <span className="badge badge-warning">Renewal</span>;
          if (tenant.status === 'Notice Given') statusBadge = <span className="badge badge-error">Notice</span>;

          return (
            <div
              key={tenant.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {/* Profile Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={tenant.avatar}
                  alt={tenant.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--electric-blue)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {tenant.name}
                    </h3>
                    {statusBadge}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--cyan-blue)', fontWeight: 700, marginTop: '2px' }}>
                    <Key size={12} /> Unit #{tenant.unit}
                  </div>
                </div>
              </div>

              {/* Icon Info Chips */}
              <div style={{
                background: 'var(--input-bg-theme)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.75rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Mail size={13} color="var(--electric-blue)" />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{tenant.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Phone size={13} color="var(--cyan-blue)" />
                  <span>{tenant.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.3rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: tenant.autoPay ? 'var(--status-online)' : 'var(--text-muted)' }}>
                    <CreditCard size={13} /> {tenant.autoPay ? 'AutoPay' : 'Manual'}
                  </span>
                  <span style={{ fontWeight: 700, color: tenant.balance > 0 ? 'var(--status-error)' : 'var(--status-online)' }}>
                    {tenant.balance > 0 ? `-$${tenant.balance}` : '$0.00 Due'}
                  </span>
                </div>
              </div>

              {/* Vehicle & Pet Icons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Car size={13} color="var(--text-muted)" /> {tenant.vehicle.split('—')[0]}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Dog size={13} color="var(--text-muted)" /> {tenant.pet.split('(')[0]}
                </span>
              </div>

              {/* Price & Action */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--electric-blue)', fontFamily: 'Outfit' }}>
                    ${tenant.monthlyRent}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => onSendNotice(tenant.name, tenant.unit)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Send Notice"
                  >
                    <Send size={12} />
                  </button>
                  <button
                    onClick={() => setSelectedTenant(tenant)}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <Eye size={12} />
                    <span>File</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tenant Modal */}
      {selectedTenant && (
        <div className="modal-overlay" onClick={() => setSelectedTenant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={selectedTenant.avatar}
                  alt={selectedTenant.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--electric-blue)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{selectedTenant.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cyan-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Key size={12} /> Unit #{selectedTenant.unit} • {selectedTenant.status}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedTenant(null)} className="btn-icon">×</button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Lease
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginTop: '3px' }}>{selectedTenant.leaseStart} → {selectedTenant.leaseEnd}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={12} /> Monthly Rent
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--electric-blue)', marginTop: '2px', fontFamily: 'Outfit' }}>${selectedTenant.monthlyRent}</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--cyan-blue)" />
                <div style={{ fontSize: '0.8rem' }}>{selectedTenant.emergencyContact}</div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--input-bg-theme)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={16} color="var(--electric-blue)" />
                <div style={{ fontSize: '0.8rem' }}>{selectedTenant.vehicle}</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-card)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setSelectedTenant(null)} className="btn btn-secondary btn-sm">Close</button>
              <button
                onClick={() => {
                  onSendNotice(selectedTenant.name, selectedTenant.unit);
                  setSelectedTenant(null);
                }}
                className="btn btn-primary btn-sm"
              >
                <Send size={13} />
                <span>Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
