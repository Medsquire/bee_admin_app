import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Layers,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export default function AssignmentApprovalModal() {
  const {
    assignmentApprovalModal,
    setAssignmentApprovalModal,
    agencies,
    reviewPropertyAssignment
  } = useApp();

  const { isOpen, agencyId, assignmentId } = assignmentApprovalModal;

  const agency = agencies.find((a) => a.id === agencyId);
  const assignment = agency?.propertyAssignments?.find((pa) => pa.id === assignmentId);

  const [decision, setDecision] = useState('Approve'); // 'Approve' | 'Approve with Restrictions' | 'Request Changes' | 'Reject'
  const [approvedServices, setApprovedServices] = useState([]);
  const [approvedBlocks, setApprovedBlocks] = useState([]);
  const [approvedStartDate, setApprovedStartDate] = useState('');
  const [approvedEndDate, setApprovedEndDate] = useState('');
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [checklist, setChecklist] = useState({
    scopeValid: true,
    staffAdequate: true,
    insuranceCurrent: true,
    sponsorConfirmed: true
  });

  useEffect(() => {
    if (assignment) {
      setApprovedServices(assignment.requestedServices || []);
      setApprovedBlocks(assignment.assignedBlocks || []);
      setApprovedStartDate(assignment.startDate || new Date().toISOString().split('T')[0]);
      setApprovedEndDate(assignment.endDate || '2027-12-31');
      setDecision('Approve');
      setComments('');
      setRejectionReason('');
    }
  }, [assignment]);

  if (!isOpen || !agency || !assignment) return null;

  const handleToggleApprovedService = (srv) => {
    if (approvedServices.includes(srv)) {
      setApprovedServices(approvedServices.filter((s) => s !== srv));
    } else {
      setApprovedServices([...approvedServices, srv]);
    }
  };

  const handleToggleApprovedBlock = (blk) => {
    if (approvedBlocks.includes(blk)) {
      setApprovedBlocks(approvedBlocks.filter((b) => b !== blk));
    } else {
      setApprovedBlocks([...approvedBlocks, blk]);
    }
  };

  const handleDecisionSubmit = (e) => {
    e.preventDefault();

    reviewPropertyAssignment(agency.id, assignment.id, {
      decision,
      approvedServices,
      approvedBlocks,
      approvedStartDate,
      approvedEndDate,
      comments: comments || (decision === 'Approve' ? 'Approved without restrictions.' : ''),
      rejectionReason,
      checklist
    });

    setAssignmentApprovalModal({ isOpen: false, agencyId: null, assignmentId: null });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setAssignmentApprovalModal({ isOpen: false, agencyId: null, assignmentId: null })}
      title="Property Assignment Approval"
      subtitle={`Request ID: ${assignment.id} • ${agency.name}`}
      size="lg"
    >
      <form onSubmit={handleDecisionSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Summary */}
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
                {assignment.propertyName} ({assignment.propertyCode})
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                Assignment Type: {assignment.assignmentType} • Submitted: {assignment.submissionDate || 'Recently'}
              </div>
            </div>

            <StatusBadge status={assignment.status} />
          </div>

          {/* Requested Scope Snapshot strictly matching PRD Section 5.H */}
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
              <span className="text-xs text-muted">Service Partner:</span>
              <div style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>{agency.name}</div>
            </div>
            <div>
              <span className="text-xs text-muted">Property Sponsor:</span>
              <div style={{ fontWeight: 600 }}>{assignment.propertyManagerSponsor || 'Property Manager'}</div>
            </div>
            <div>
              <span className="text-xs text-muted">Requested Timeline:</span>
              <div style={{ fontWeight: 600 }}>
                {assignment.startDate} to {assignment.endDate || 'Indefinite'}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted">Operational Hours:</span>
              <div style={{ fontWeight: 600 }}>{assignment.expectedHours || 'Standard Working Hours'}</div>
            </div>
          </div>

          {/* Requested Services */}
          <div>
            <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.35rem' }}>
              REQUESTED SERVICES ({(assignment.requestedServices || []).length})
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(assignment.requestedServices || []).map((srv) => (
                <span key={srv} className="badge badge-blue">
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Administrative Verification Checklist */}
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
              PROPERTY ACCESS VERIFICATION CHECKLIST
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.scopeValid}
                  onChange={(e) => setChecklist({ ...checklist, scopeValid: e.target.checked })}
                />
                Target property blocks and access zones verified
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.staffAdequate}
                  onChange={(e) => setChecklist({ ...checklist, staffAdequate: e.target.checked })}
                />
                Agency workforce capacity adequate
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.insuranceCurrent}
                  onChange={(e) => setChecklist({ ...checklist, insuranceCurrent: e.target.checked })}
                />
                Site liability cover active
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checklist.sponsorConfirmed}
                  onChange={(e) => setChecklist({ ...checklist, sponsorConfirmed: e.target.checked })}
                />
                Community manager sponsorship confirmed
              </label>
            </div>
          </div>

          {/* Approval Decision Selection strictly matching PRD Section 5.H */}
          <div>
            <label className="form-label">Approval Decision <span style={{ color: 'var(--error)' }}>*</span></label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${decision === 'Approve' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDecision('Approve')}
              >
                <CheckCircle2 size={15} />
                Approve Full Scope
              </button>

              <button
                type="button"
                className={`btn btn-sm ${decision === 'Approve with Restrictions' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDecision('Approve with Restrictions')}
                style={{
                  backgroundColor: decision === 'Approve with Restrictions' ? '#0284C7' : undefined
                }}
              >
                <ShieldCheck size={15} />
                Approve with Restrictions
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
                Reject
              </button>
            </div>
          </div>

          {/* If "Approve with Restrictions", allow selecting specific approved services and blocks! */}
          {decision === 'Approve with Restrictions' && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--light-blue)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-blue-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--dark-navy)' }}>
                Configure Approved Restrictions Scope:
              </div>

              {/* Select Approved Services Subset */}
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Select Approved Services Subset:
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(assignment.requestedServices || []).map((srv) => {
                    const isApproved = approvedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        className={`btn btn-sm ${isApproved ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleToggleApprovedService(srv)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {isApproved ? '✓ ' : ''}{srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Approved Blocks Subset */}
              <div>
                <label className="text-xs font-semibold text-muted" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Select Approved Towers / Blocks:
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(assignment.assignedBlocks || []).map((blk) => {
                    const isApproved = approvedBlocks.includes(blk);
                    return (
                      <button
                        key={blk}
                        type="button"
                        className={`btn btn-sm ${isApproved ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleToggleApprovedBlock(blk)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {isApproved ? '✓ ' : ''}{blk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Approved Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="text-xs font-semibold text-muted">Approved Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={approvedStartDate}
                    onChange={(e) => setApprovedStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted">Approved End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={approvedEndDate}
                    onChange={(e) => setApprovedEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reason for Rejection or Change Request */}
          {(decision === 'Request Changes' || decision === 'Reject') && (
            <div>
              <label className="form-label">
                {decision === 'Request Changes' ? 'Specify Changes Required' : 'Rejection Reason'} <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Reason for decision..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Administrative Notes / Comments</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="Internal remarks for assignment record..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAssignmentApprovalModal({ isOpen: false, agencyId: null, assignmentId: null })}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Execute Decision: {decision}
          </button>
        </div>
      </form>
    </Modal>
  );
}
