import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react';

export default function SecurityAllocationModal() {
  const {
    securityAllocationModalOpen,
    setSecurityAllocationModalOpen,
    apartments,
    agencies,
    allocateSecurity
  } = useApp();

  const securityAgencies = agencies.filter((a) =>
    a.categories.includes('Security Services')
  );

  const [apartmentId, setApartmentId] = useState(apartments[0]?.id || '');
  const [agencyId, setAgencyId] = useState(securityAgencies[0]?.id || '');
  const [zone, setZone] = useState('All Perimeter Gates & Main Entrance');
  const [shift, setShift] = useState('Morning Shift (06:00 - 14:00)');
  const [requiredGuards, setRequiredGuards] = useState(2);
  const [selectedGuards, setSelectedGuards] = useState([]);

  if (!securityAllocationModalOpen) return null;

  const currentAgency = agencies.find((a) => a.id === agencyId);
  const availableGuards =
    currentAgency?.personnel?.filter(
      (p) => p.status === 'Available' || p.status === 'Unassigned'
    ) || [];

  const handleToggleGuard = (name) => {
    if (selectedGuards.includes(name)) {
      setSelectedGuards(selectedGuards.filter((n) => n !== name));
    } else {
      if (selectedGuards.length < requiredGuards) {
        setSelectedGuards([...selectedGuards, name]);
      }
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!agencyId || !apartmentId) return;

    allocateSecurity({
      apartmentId,
      agencyId,
      blockName: zone,
      shift,
      requiredGuards: Number(requiredGuards),
      allocatedGuards: selectedGuards.length > 0 ? selectedGuards.length : Number(requiredGuards),
      personnelNames: selectedGuards.length > 0 ? selectedGuards : [`${requiredGuards} Security Officers`]
    });

    setSecurityAllocationModalOpen(false);
  };

  return (
    <Modal
      isOpen={securityAllocationModalOpen}
      onClose={() => setSecurityAllocationModalOpen(false)}
      title="Allocate Security Agency & Personnel"
      subtitle="Deploy licensed security squads to communities, towers, and perimeter gates"
      size="md"
    >
      <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Target Apartment Community */}
          <div>
            <label className="form-label">Apartment Community</label>
            <select
              className="form-select"
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              required
            >
              {apartments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.name} ({apt.city})
                </option>
              ))}
            </select>
          </div>

          {/* Deployment Zone */}
          <div>
            <label className="form-label">Perimeter Gate / Block Zone</label>
            <select
              className="form-select"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              <option value="All Perimeter Gates & Main Entrance">All Perimeter Gates & Main Entrance</option>
              <option value="Main Gatehouse & Visitor RFID Verification">Main Gatehouse & Visitor RFID Verification</option>
              <option value="North Wing & Tower Entrance">North Wing & Tower Entrance</option>
              <option value="Basement Parking & EV Charging Zone">Basement Parking & EV Charging Zone</option>
              <option value="Clubhouse & Swimming Pool Area">Clubhouse & Swimming Pool Area</option>
            </select>
          </div>

          {/* Security Agency Selection */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <label className="form-label">Security Agency</label>
            <select
              className="form-select"
              value={agencyId}
              onChange={(e) => {
                setAgencyId(e.target.value);
                setSelectedGuards([]);
              }}
              required
            >
              {securityAgencies.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.availablePersonnel} Guards Available)
                </option>
              ))}
            </select>

            {currentAgency && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem'
                }}
              >
                <span>
                  Total Roster: <strong>{currentAgency.totalPersonnel}</strong>
                </span>
                <span>
                  Currently Allocated: <strong>{currentAgency.allocatedPersonnel}</strong>
                </span>
                <span style={{ color: currentAgency.availablePersonnel > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>
                  Available: {currentAgency.availablePersonnel}
                </span>
              </div>
            )}
          </div>

          {/* Shift & Required Guards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="form-label">Deployment Shift</label>
              <select
                className="form-select"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                <option value="24/7 Standing Rotation">24/7 Standing Rotation</option>
              </select>
            </div>

            <div>
              <label className="form-label">Required Guards Count</label>
              <input
                type="number"
                min="1"
                max={Math.max(1, currentAgency?.availablePersonnel || 5)}
                className="form-input"
                value={requiredGuards}
                onChange={(e) => setRequiredGuards(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Named Available Guards Selection */}
          {availableGuards.length > 0 && (
            <div>
              <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Select Named Guards ({selectedGuards.length} of {requiredGuards} selected)
                </label>
                <span className="text-xs text-muted">Prevent overlapping allocations</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {availableGuards.map((guard) => {
                  const isChecked = selectedGuards.includes(guard.name);

                  return (
                    <label
                      key={guard.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked
                          ? '1px solid var(--primary-blue)'
                          : '1px solid var(--border-color)',
                        backgroundColor: isChecked ? 'var(--light-blue)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleGuard(guard.name)}
                        style={{ accentColor: 'var(--primary-blue)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{guard.name}</div>
                        <div className="text-xs text-muted">{guard.role}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSecurityAllocationModalOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <ShieldCheck size={16} />
            Confirm Deployment
          </button>
        </div>
      </form>
    </Modal>
  );
}
