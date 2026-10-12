import React, { useState } from 'react';
import { X, Wrench, AlertCircle, CheckCircle } from 'lucide-react';

export function NewWorkOrderModal({ isOpen, onClose, onSubmit, defaultUnit = '101', units = [] }) {
  if (!isOpen) return null;

  const [unit, setUnit] = useState(defaultUnit);
  const [category, setCategory] = useState('HVAC');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [technician, setTechnician] = useState('Alex Mercer (Prime HVAC)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      unit,
      category,
      title,
      description,
      priority,
      assignedTo: technician
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--electric-blue)' }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Dispatch Work Order</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Create maintenance request with automated certified contractor dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Apartment Unit #
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-input form-select"
              >
                {units.map(u => (
                  <option key={u.id} value={u.number}>
                    Unit #{u.number} ({u.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Trade Specialty
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input form-select"
              >
                <option value="HVAC">HVAC & Climate</option>
                <option value="Plumbing">Plumbing & Drains</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Appliance">Kitchen & Laundry Appliance</option>
                <option value="Security">Smart Lock / Access</option>
                <option value="Carpentry">Carpentry & Drywall</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Issue Subject / Headline
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master bath thermostatic mixer valve leak"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Detailed Description & Diagnostics
            </label>
            <textarea
              rows={3}
              placeholder="Provide symptoms, tenant notes, access instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Priority Severity
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-input form-select"
              >
                <option value="Low">Low (Scheduled Routine)</option>
                <option value="Medium">Medium (Within 24 Hours)</option>
                <option value="High">High (Same Day Urgent)</option>
                <option value="Urgent">Emergency (Immediate Dispatch)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Assigned Vendor / Tech
              </label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="form-input form-select"
              >
                <option value="Alex Mercer (Prime HVAC)">Alex Mercer (Prime HVAC)</option>
                <option value="Dave Callahan (Rapid Flow Plumbing)">Dave Callahan (Rapid Flow Plumbing)</option>
                <option value="Elena Rostova (Apex Electric)">Elena Rostova (Apex Electric)</option>
                <option value="Carlos Mendez (In-House Facilities)">Carlos Mendez (In-House Facilities)</option>
                <option value="SecureLink Systems">SecureLink Systems</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Dispatch Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
