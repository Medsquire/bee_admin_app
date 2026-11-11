import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Shield,
  FileCheck
} from 'lucide-react';

export default function RegistrationReviewModal() {
  const {
    registrationReviewModal,
    setRegistrationReviewModal,
    agencies,
    reviewAgencyRegistration
  } = useApp();

  const { isOpen, agencyId } = registrationReviewModal;

  const agency = agencies.find((a) => a.id === agencyId);

  const [decision, setDecision] = useState('Approve'); // 'Approve' | 'Request Changes' | 'Reject'
  const [comments, setComments] = useState('');
  const [changesRequested, setChangesRequested] = useState('');
  const [checklist, setChecklist] = useState({
    identityVerified: true,
    gstVerified: true,
    panVerified: true,
    insuranceActive: true,
    servicesConform: true
  });

  if (!isOpen || !agency) return null;

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    reviewAgencyRegistration(
      agency.id,
      decision,
      comments || (decision === 'Approve' ? 'All company registration certificates and compliance criteria approved.' : 'Action required.'),
      decision === 'Request Changes' ? changesRequested : null
    );
    setRegistrationReviewModal({ isOpen: false, agencyId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setRegistrationReviewModal({ isOpen: false, agencyId: null })}
      title={`Review Agency Registration — ${agency.name}`}
      subtitle={`Registration Ref: ${agency.registrationRefNumber} • Submitted: ${agency.submissionDate}`}
      size="lg"
    >
      <form onSubmit={handleDecisionSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                {agency.name}
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                Primary Agent: {agency.contactPerson} ({agency.email})
              </div>
            </div>

            <StatusBadge status={agency.registrationStatus} />
          </div>

          {/* Company Details Snapshot */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              padding: '0.875rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8125rem'
            }}
          >
            <div>
              <span className="text-xs text-muted">Business Type:</span>
              <div style={{ fontWeight: 600 }}>{agency.company?.businessType || 'Private Limited'}</div>
            </div>
            <div>
              <span className="text-xs text-muted">Registration No:</span>
              <div style={{ fontWeight: 600 }}>{agency.company?.registrationNumber || 'Pending'}</div>
            </div>
            <div>
              <span className="text-xs text-muted">GSTIN:</span>
              <div style={{ fontWeight: 600 }}>{agency.company?.gstin || '27AABCU9603R1Z5'}</div>
            </div>
            <div>
              <span className="text-xs text-muted">PAN:</span>
              <div style={{ fontWeight: 600 }}>{agency.company?.pan || 'AABCU9603R'}</div>
            </div>
          </div>

          {/* Registered Services */}
          <div>
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.4rem' }}>
              OFFERED SERVICE CATEGORIES ({agency.services?.length || agency.categories?.length || 0})
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(agency.services || []).map((s) => (
                <span key={s.id || s.category} className="badge badge-blue">
                  {s.category} ({s.experienceYears} yrs)
                </span>
              ))}
              {(!agency.services || agency.services.length === 0) &&
                (agency.categories || []).map((c) => (
                  <span key={c} className="badge badge-blue">
                    {c}
                  </span>
                ))}
            </div>
          </div>

          {/* Uploaded Documents Verification */}
          <div>
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.4rem' }}>
              UPLOADED CORPORATE DOCUMENTS ({(agency.documents || []).length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {(agency.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={15} color="var(--primary-blue)" />
                    <span><strong>{doc.documentType}</strong> ({doc.fileName})</span>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>
                    {doc.verificationStatus || 'Verified'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Checklist strictly matching PRD Section 5.H */}
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
              ADMINISTRATIVE VERIFICATION CHECKLIST
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.identityVerified}
                  onChange={(e) => setChecklist({ ...checklist, identityVerified: e.target.checked })}
                />
                Authorized Signatory ID Confirmed
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.gstVerified}
                  onChange={(e) => setChecklist({ ...checklist, gstVerified: e.target.checked })}
                />
                GST & Corporate Identity Validated
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.insuranceActive}
                  onChange={(e) => setChecklist({ ...checklist, insuranceActive: e.target.checked })}
                />
                Liability Insurance Active
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.servicesConform}
                  onChange={(e) => setChecklist({ ...checklist, servicesConform: e.target.checked })}
                />
                Service Capabilities Verified
              </label>
            </div>
          </div>

          {/* Decision Selection strictly matching PRD Section 5.H */}
          <div>
            <label className="form-label">Administrative Decision</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${decision === 'Approve' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDecision('Approve')}
              >
                <CheckCircle2 size={15} />
                Approve for Property Assignment
              </button>

              <button
                type="button"
                className={`btn btn-sm ${decision === 'Request Changes' ? 'btn-warning' : 'btn-secondary'}`}
                onClick={() => setDecision('Request Changes')}
              >
                <AlertTriangle size={15} />
                Request Changes
              </button>

              <button
                type="button"
                className={`btn btn-sm ${decision === 'Reject' ? 'btn-ghost text-error' : 'btn-secondary'}`}
                onClick={() => setDecision('Reject')}
              >
                <XCircle size={15} />
                Reject Registration
              </button>
            </div>
          </div>

          {decision === 'Request Changes' && (
            <div>
              <label className="form-label">Specify Changes Required <span style={{ color: 'var(--error)' }}>*</span></label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="e.g. Please upload updated insurance certificate with policy validity through 2027..."
                value={changesRequested}
                onChange={(e) => setChangesRequested(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Admin Comments / Notes</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="Internal review remarks..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setRegistrationReviewModal({ isOpen: false, agencyId: null })}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Confirm Decision: {decision}
          </button>
        </div>
      </form>
    </Modal>
  );
}
