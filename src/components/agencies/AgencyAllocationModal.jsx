import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export default function AgencyAllocationModal() {
  const {
    agencyAllocationRequest,
    setAgencyAllocationRequest,
    agencies,
    assignAgencyToMaintenance
  } = useApp();

  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('09:00 - 12:00 (Morning Slot)');
  const [prevReqId, setPrevReqId] = useState(null);

  const req = agencyAllocationRequest;

  // Filter compatible agencies by category
  const compatibleAgencies = React.useMemo(() => {
    if (!req) return [];
    return agencies.filter((ag) =>
      ag.categories.some(
        (cat) =>
          cat.toLowerCase() === req.category.toLowerCase() ||
          req.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(req.category.toLowerCase()) ||
          cat === 'General Maintenance'
      )
    );
  }, [agencies, req]);

  // Sync selected agency when request changes
  if (req && req.id !== prevReqId) {
    setPrevReqId(req.id);
    if (compatibleAgencies.length > 0) {
      const bestMatch =
        compatibleAgencies.find((a) => a.availablePersonnel > 0) || compatibleAgencies[0];
      setSelectedAgencyId(bestMatch.id);
    } else {
      setSelectedAgencyId('');
    }
    setSelectedPersonnel([]);
  }

  if (!req) return null;

  const currentAgency = agencies.find((a) => a.id === selectedAgencyId);

  const availableStaff = currentAgency?.personnel?.filter(
    (p) => p.status === 'Available' || p.status === 'Unassigned'
  ) || [];

  const handleTogglePersonnel = (name) => {
    if (selectedPersonnel.includes(name)) {
      setSelectedPersonnel(selectedPersonnel.filter((n) => n !== name));
    } else {
      setSelectedPersonnel([...selectedPersonnel, name]);
    }
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!selectedAgencyId) return;

    const personnelToAssign =
      selectedPersonnel.length > 0
        ? selectedPersonnel
        : availableStaff.length > 0
        ? [availableStaff[0].name]
        : [`${currentAgency.name} Dispatch Tech`];

    assignAgencyToMaintenance(
      req.id,
      selectedAgencyId,
      personnelToAssign,
      scheduledDate,
      scheduledTime
    );

    setAgencyAllocationRequest(null);
  };

  return (
    <Modal
      isOpen={Boolean(agencyAllocationRequest)}
      onClose={() => setAgencyAllocationRequest(null)}
      title="Allocate Maintenance Service Provider"
      subtitle={`Ticket #${req.id} • ${req.apartmentName}`}
      size="lg"
    >
      <form onSubmit={handleConfirmAssignment}>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1 & 2: Maintenance Request Overview */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem'
            }}
          >
            <div className="flex-between">
              <span className="badge badge-blue">Target Work Order</span>
              <StatusBadge status={req.priority} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                {req.title}
              </h3>
              <p className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                {req.apartmentName} • {req.blockName || 'Common Grounds'} {req.flatNumber ? `(Flat ${req.flatNumber})` : ''}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.8125rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-light)'
              }}
            >
              <span>
                Category: <strong>{req.category}</strong>
              </span>
              <span>•</span>
              <span>
                Reported Date: <strong>{req.reportedDate}</strong>
              </span>
            </div>
          </div>

          {/* Step 3 & 4: Compatible Agencies List */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.625rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Compatible Service Agencies ({compatibleAgencies.length})
              </label>
              <span className="text-xs text-muted">
                Showing vetted providers for "{req.category}"
              </span>
            </div>

            {compatibleAgencies.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#FEF2F2',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--error-border)',
                  color: 'var(--error)',
                  textAlign: 'center',
                  fontSize: '0.875rem'
                }}
              >
                No registered agency matches this category directly. You can allocate a General Maintenance agency or add a new provider in the Agencies module.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {compatibleAgencies.map((agency) => {
                  const isSelected = selectedAgencyId === agency.id;

                  return (
                    <div
                      key={agency.id}
                      onClick={() => {
                        setSelectedAgencyId(agency.id);
                        setSelectedPersonnel([]);
                      }}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected
                          ? '2px solid var(--primary-blue)'
                          : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--light-blue)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div className="flex-between">
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
                          {agency.name}
                        </span>
                        <StatusBadge status={agency.availabilityStatus} />
                      </div>

                      <div className="text-xs text-muted">
                        Available Personnel: <strong>{agency.availablePersonnel} / {agency.totalPersonnel}</strong>
                      </div>

                      <div className="text-xs text-muted">
                        Contact: {agency.contactPerson} ({agency.phone})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 5 & 6: Available Named Personnel Selection */}
          {currentAgency && (
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Assign Specific Available Personnel ({currentAgency.name})
                </label>
                <span className="text-xs text-muted">Select 1 or more certified technicians</span>
              </div>

              {availableStaff.length === 0 ? (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#FFFBEB',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--warning-border)',
                    fontSize: '0.8125rem',
                    color: 'var(--warning)'
                  }}
                >
                  No named personnel currently listed as Available in roster. General dispatch team will be scheduled.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                  {availableStaff.map((staff) => {
                    const isChecked = selectedPersonnel.includes(staff.name);

                    return (
                      <label
                        key={staff.id}
                        style={{
                          padding: '0.625rem 0.875rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isChecked
                            ? '1px solid var(--primary-blue)'
                            : '1px solid var(--border-color)',
                          backgroundColor: isChecked ? 'var(--light-blue)' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePersonnel(staff.name)}
                          style={{ accentColor: 'var(--primary-blue)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{staff.name}</div>
                          <div className="text-xs text-muted">{staff.role} ({staff.experience})</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Schedule Date and Time Slot */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <label className="form-label">Scheduled Service Date</label>
              <input
                type="date"
                className="form-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Service Time Window</label>
              <select
                className="form-select"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              >
                <option value="09:00 - 12:00 (Morning Slot)">09:00 - 12:00 (Morning Slot)</option>
                <option value="14:00 - 17:00 (Afternoon Slot)">14:00 - 17:00 (Afternoon Slot)</option>
                <option value="17:00 - 20:00 (Evening Slot)">17:00 - 20:00 (Evening Slot)</option>
                <option value="Full Day Emergency Slot">Full Day Emergency Slot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 8: Confirm Action */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAgencyAllocationRequest(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!selectedAgencyId}
          >
            <CheckCircle2 size={16} />
            Confirm Assignment & Dispatch
          </button>
        </div>
      </form>
    </Modal>
  );
}
