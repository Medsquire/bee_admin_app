import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { Eye, Edit2, Shield, Layers } from 'lucide-react';

export default function AgencyTable({ agencies, onSelectAgency }) {
  const {
    setAgencyOnboardingModal,
    setPropertyAssignmentModal,
    setRegistrationReviewModal,
    setAssignmentApprovalModal
  } = useApp();

  return (
    <div
      className="card"
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
        <thead>
          <tr
            style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            <th style={{ padding: '0.875rem 1.25rem' }}>Agency / Company Name</th>
            <th style={{ padding: '0.875rem 1rem' }}>Contact Person</th>
            <th style={{ padding: '0.875rem 1rem' }}>Service Categories</th>
            <th style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>Total Staff</th>
            <th style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>Allocated</th>
            <th style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>Available</th>
            <th style={{ padding: '0.875rem 1rem' }}>Registered Properties</th>
            <th style={{ padding: '0.875rem 1rem' }}>Registration Status</th>
            <th style={{ padding: '0.875rem 1rem' }}>Availability</th>
            <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agencies.map((agency) => {
            const isPendingRegistration =
              agency.registrationStatus === 'Submitted' || agency.registrationStatus === 'Under Review';

            const pendingAssignments = (agency.propertyAssignments || []).filter(
              (pa) => pa.status === 'Submitted for Approval' || pa.status === 'Under Review'
            );

            const approvedAssignments = (agency.propertyAssignments || []).filter(
              (pa) => pa.status === 'Approved' || pa.status === 'Approved with Restrictions'
            );

            return (
              <tr
                key={agency.id}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.8125rem',
                  transition: 'background-color 0.15s ease'
                }}
                className="table-row-hover"
              >
                {/* Agency Name */}
                <td style={{ padding: '0.875rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--light-blue)',
                        color: 'var(--primary-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        flexShrink: 0
                      }}
                    >
                      {agency.logoText || 'AG'}
                    </div>
                    <div>
                      <div
                        style={{ fontWeight: 700, color: 'var(--dark-navy)', cursor: 'pointer' }}
                        className="breadcrumb-link"
                        onClick={() => onSelectAgency(agency.id)}
                      >
                        {agency.name}
                      </div>
                      <div className="text-xs text-muted">
                        Ref: {agency.registrationRefNumber || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Person */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                    {agency.contactPerson}
                  </div>
                  <div className="text-xs text-muted">
                    {agency.phone}
                  </div>
                </td>

                {/* Service Categories */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '240px' }}>
                    {(agency.categories || []).slice(0, 2).map((cat) => (
                      <span key={cat} className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>
                        {cat}
                      </span>
                    ))}
                    {(agency.categories || []).length > 2 && (
                      <span className="badge badge-slate" style={{ fontSize: '0.6875rem' }}>
                        +{(agency.categories || []).length - 2}
                      </span>
                    )}
                  </div>
                </td>

                {/* Total Personnel */}
                <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>
                  {agency.totalPersonnel}
                </td>

                {/* Allocated */}
                <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {agency.allocatedPersonnel}
                </td>

                {/* Available */}
                <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--success)' }}>
                  {agency.availablePersonnel}
                </td>

                {/* Registered Properties */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                    {approvedAssignments.length} Approved
                  </div>
                  {pendingAssignments.length > 0 && (
                    <div className="text-xs" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                      {pendingAssignments.length} Pending Review
                    </div>
                  )}
                </td>

                {/* Registration Status */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <StatusBadge status={agency.registrationStatus || 'Approved for Property Assignment'} />
                </td>

                {/* Availability */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <StatusBadge status={agency.availabilityStatus} />
                </td>

                {/* Actions */}
                <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    {isPendingRegistration && (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => setRegistrationReviewModal({ isOpen: true, agencyId: agency.id })}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="Review Registration"
                      >
                        Review
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
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="Review Property Assignment"
                      >
                        Scope
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        setAgencyOnboardingModal({ isOpen: true, mode: 'edit', agencyId: agency.id })
                      }
                      title="Edit Agency"
                      style={{ padding: '0.25rem 0.45rem' }}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectAgency(agency.id)}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                      title="View Details"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
