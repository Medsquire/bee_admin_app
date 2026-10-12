import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export function NewTenantModal({ isOpen, onClose, onSubmit, units = [] }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [unit, setUnit] = useState(units[0]?.number || '102');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyRent, setMonthlyRent] = useState(2400);
  const [leaseEnd, setLeaseEnd] = useState('2027-10-31');
  const [vehicle, setVehicle] = useState('');
  const [pet, setPet] = useState('None');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      unit,
      email,
      phone,
      monthlyRent: Number(monthlyRent),
      leaseEnd,
      vehicle: vehicle || 'Standard Bay #P2',
      pet: pet || 'None',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      autoPay: true,
      balance: 0,
      emergencyContact: 'Family Member • +1 (555) 000-1122'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan-blue)' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Onboard Resident & New Lease</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generate digital lease agreement and issue RFID access</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Resident Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Apartment Unit Assigned
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-input form-select"
              >
                {units.map(u => (
                  <option key={u.id} value={u.number}>
                    Unit #{u.number} ({u.status} - ${u.rent})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Primary Email
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Agreed Monthly Rent ($)
              </label>
              <input
                type="number"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Lease Term End Date
              </label>
              <input
                type="date"
                required
                value={leaseEnd}
                onChange={(e) => setLeaseEnd(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Registered Vehicle / License Plate
              </label>
              <input
                type="text"
                placeholder="e.g. Tesla Model 3 (8ABC99)"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Pet Registration
              </label>
              <input
                type="text"
                placeholder="e.g. Golden Retriever or None"
                value={pet}
                onChange={(e) => setPet(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Resident Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
