import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { Wrench } from 'lucide-react';

export default function MaintenanceDetailModal() {
  const {
    maintenanceDetailModalRequest,
    setMaintenanceDetailModalRequest,
    setAgencyAllocationRequest,
    updateMaintenanceStatus
  } = useApp();

  if (!maintenanceDetailModalRequest) return null;

  const req = maintenanceDetailModalRequest;

  return (
    <Modal
      isOpen={Boolean(maintenanceDetailModalRequest)}
      onClose={() => setMaintenanceDetailModalRequest(null)}
      title="Maintenance Work Order Details"
      subtitle={`Ticket #${req.id} • Reported on ${req.reportedDate}`}
      size="md"
    >
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title & Status */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)', marginBottom: '0.2rem' }}>
              {req.category}
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
              {req.title}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
            <StatusBadge status={req.status} />
            <StatusBadge status={req.priority} />
          </div>
        </div>

        {/* Location Specs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div>
            <span className="text-xs text-muted">Apartment Community:</span>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.15rem' }}>
              {req.apartmentName}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted">Target Location:</span>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.15rem' }}>
              {req.blockName || 'Common Area'}
              {req.flatNumber ? ` (Flat ${req.flatNumber})` : ''}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted">Scope Level:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {req.scope || 'Unit'}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted">Reported By:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {req.reportedBy || 'Resident Desk'}
            </div>
          </div>
        </div>

        {/* Technical Description */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
            Diagnostic Description
          </h3>
          <p
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              lineHeight: 1.6,
              fontSize: '0.8125rem'
            }}
          >
            {req.description}
          </p>
        </div>

        {/* Allocation Info */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: req.assignedAgencyName ? 'var(--light-blue)' : '#FFFBEB',
            borderRadius: 'var(--radius-md)',
            border: req.assignedAgencyName ? '1px solid var(--primary-blue-border)' : '1px solid var(--warning-border)'
          }}
        >
          <div className="flex-between">
            <span
              className="text-xs font-semibold"
              style={{ color: req.assignedAgencyName ? 'var(--primary-blue)' : 'var(--warning)' }}
            >
              AGENCY ALLOCATION STATUS
            </span>
            {req.assignedAgencyName && (
              <span className="badge badge-blue">Allocated</span>
            )}
          </div>

          {req.assignedAgencyName ? (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                {req.assignedAgencyName}
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                Assigned Technicians: <strong>{req.assignedPersonnel?.join(', ') || 'Team Dispatched'}</strong>
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                Scheduled Slot: <strong>{req.scheduledDate} ({req.scheduledTime || 'Standard Hours'})</strong>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                No Service Provider Allocated Yet
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                Allocate an authorized agency matching the "{req.category}" category.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        {req.status !== 'Assigned' && req.status !== 'Completed' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const target = req;
              setMaintenanceDetailModalRequest(null);
              setAgencyAllocationRequest(target);
            }}
          >
            <Wrench size={15} />
            Assign Agency
          </button>
        )}

        {req.status === 'Assigned' && (
          <button
            type="button"
            className="btn btn-subtle"
            onClick={() => {
              updateMaintenanceStatus(req.id, 'In Progress');
              setMaintenanceDetailModalRequest(null);
            }}
          >
            Mark In Progress
          </button>
        )}

        {req.status === 'In Progress' && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              updateMaintenanceStatus(req.id, 'Completed');
              setMaintenanceDetailModalRequest(null);
            }}
            style={{ color: 'var(--success)' }}
          >
            Mark Completed
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setMaintenanceDetailModalRequest(null)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
