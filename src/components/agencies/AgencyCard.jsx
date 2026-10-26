import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Edit2,
  Clock,
  ShieldCheck,
  Shield
} from 'lucide-react';

export default function AgencyCard({ agency, onSelect }) {
  const {
    setAgencyOnboardingModal,
    setPropertyAssignmentModal,
    setRegistrationReviewModal,
    setAssignmentApprovalModal
  } = useApp();

  const isPendingRegistration =
    agency.registrationStatus === 'Submitted' || agency.registrationStatus === 'Under Review';

  const pendingAssignments = (agency.propertyAssignments || []).filter(
    (pa) => pa.status === 'Submitted for Approval' || pa.status === 'Under Review'
  );

  const assignedPropertiesCount = (agency.propertyAssignments || []).filter(
    (pa) => pa.status === 'Approved' || pa.status === 'Approved with Restrictions'
  ).length;

  return (
    <div
      className="card card-interactive"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Agency Header strictly matching PRD Section 5.C */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9375rem',
                border: '1px solid var(--primary-blue-border)',
                flexShrink: 0
              }}
            >
              {agency.logoText || 'AG'}
            </div>

            <div>
              <h3
                style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)', cursor: 'pointer' }}
                onClick={() => onSelect(agency.id)}
                className="breadcrumb-link"
              >
                {agency.name}
              </h3>
              <div className="text-xs text-muted" style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                {agency.category}
              </div>
            </div>
          </div>

          {/* Badges strictly matching PRD: registration status badge + availability badge shown separately! */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            <StatusBadge status={agency.registrationStatus || 'Approved for Property Assignment'} />
            <StatusBadge status={agency.availabilityStatus} />
          </div>
        </div>

        {/* Agency Information: Contact person, number, email, personnel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            padding: '0.625rem 0.75rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem'
          }}
        >
          <div>
            <span className="text-muted">Contact:</span>
            <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{agency.contactPerson}</div>
          </div>
          <div>
            <span className="text-muted">Phone:</span>
            <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{agency.phone}</div>
          </div>
          <div style={{ gridColumn: '1 / -1', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span className="text-muted">Email:</span> {agency.email}
          </div>
        </div>

        {/* Workforce Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.35rem',
            textAlign: 'center',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ padding: '0.35rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <div className="text-muted" style={{ fontSize: '0.6875rem' }}>Total Staff</div>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>{agency.totalPersonnel}</div>
          </div>
          <div style={{ padding: '0.35rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--primary-blue)', fontWeight: 600 }}>Allocated</div>
            <div style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.875rem' }}>{agency.allocatedPersonnel}</div>
          </div>
          <div style={{ padding: '0.35rem', backgroundColor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--success)', fontWeight: 600 }}>Available</div>
            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>{agency.availablePersonnel}</div>
          </div>
        </div>

        {/* Services Badges */}
        <div>
          <div className="text-xs text-muted" style={{ marginBottom: '0.25rem', fontSize: '0.6875rem', fontWeight: 600 }}>
            SERVICES OFFERED:
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {(agency.categories || []).slice(0, 3).map((cat) => (
              <span key={cat} className="badge badge-slate" style={{ fontSize: '0.6875rem' }}>
                {cat}
              </span>
            ))}
            {(agency.categories || []).length > 3 && (
              <span className="badge badge-slate" style={{ fontSize: '0.6875rem' }}>
                +{(agency.categories || []).length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Assignment Information: Assigned properties, active assignments, pending requests */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'auto', paddingTop: '0.35rem' }}>
          <span><strong>{assignedPropertiesCount}</strong> Properties Assigned</span>
          <span>•</span>
          <span><strong>{agency.activeAssignmentsCount || 0}</strong> Active Jobs</span>
          {pendingAssignments.length > 0 && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--warning)', fontWeight: 700 }}>
                {pendingAssignments.length} Pending
              </span>
            </>
          )}
        </div>

        {/* Card Actions strictly matching PRD Section 5.C */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-light)',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setAgencyOnboardingModal({ isOpen: true, mode: 'edit', agencyId: agency.id })}
              title="Edit Agency"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Edit2 size={13} />
              Edit
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setPropertyAssignmentModal({ isOpen: true, agencyId: agency.id })}
              title="Manage Assignments"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Layers size={13} />
              Assign
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {isPendingRegistration && (
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={() => setRegistrationReviewModal({ isOpen: true, agencyId: agency.id })}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Review Reg
              </button>
            )}

            {pendingAssignments.length > 0 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setAssignmentApprovalModal({
                    isOpen: true,
                    agencyId: agency.id,
                    assignmentId: pendingAssignments[0].id
                  })
                }
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                Review Scope
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onSelect(agency.id)}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            >
              <span>Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
