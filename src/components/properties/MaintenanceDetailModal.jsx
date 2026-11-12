import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  MessageSquare,
  Send,
  User,
  Clock,
  MapPin,
  Building2,
  Layers,
  FileText,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

const FEEDBACK_PRESETS = [
  'Please inspect this issue',
  'Work appears delayed',
  'Please provide an update',
  'Maintenance required urgently',
  'Need agency follow-up'
];

export default function MaintenanceDetailModal() {
  const {
    maintenanceDetailModalRequest,
    setMaintenanceDetailModalRequest,
    addMaintenanceFeedback,
    currentUser
  } = useApp();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (!maintenanceDetailModalRequest) return null;

  const req = maintenanceDetailModalRequest;

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    addMaintenanceFeedback(req.id, {
      message: feedbackText.trim(),
      adminName: currentUser?.name || 'Sarah Jenkins',
      status: 'Sent'
    });

    setFeedbackText('');
    setIsFeedbackOpen(false);
  };

  return (
    <Modal
      isOpen={Boolean(maintenanceDetailModalRequest)}
      onClose={() => setMaintenanceDetailModalRequest(null)}
      title="Maintenance Work Order Details"
      size="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div
          className="modal-body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto'
          }}
        >
        {/* Title & Status */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-subtle)',
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-navy)', margin: 0 }}>
              {req.title}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
            <StatusBadge status={req.status} />
            <StatusBadge status={req.priority} />
          </div>
        </div>

        {/* Location & Property Scope Specifications */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.875rem',
            padding: '1.125rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div>
            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Building2 size={13} color="var(--primary-blue)" />
              Property Community:
            </span>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
              {req.apartmentName}
            </div>
          </div>

          <div>
            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={13} color="var(--primary-blue)" />
              Target Location:
            </span>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
              {req.blockName || 'Community Common Grounds'}
              {req.floorName ? ` (${req.floorName})` : ''}
            </div>
          </div>

          <div>
            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={13} color="var(--primary-blue)" />
              Scope Level:
            </span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                {req.scope || 'Property / Common Area'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} color="var(--primary-blue)" />
              Reported On:
            </span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {req.reportedDate} <span className="text-xs text-muted">by {req.reportedBy || 'Facility Team'}</span>
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
              backgroundColor: 'var(--bg-subtle)',
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

        {/* Agency Allocation Info */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: req.assignedAgencyName ? 'var(--light-blue)' : 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: req.assignedAgencyName ? '1px solid var(--primary-blue-border)' : '1px solid var(--border-color)'
          }}
        >
          <div className="flex-between">
            <span
              className="text-xs font-semibold"
              style={{ color: req.assignedAgencyName ? 'var(--primary-blue)' : 'var(--text-muted)' }}
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
                Matching Category: <strong>{req.category}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Documentation & Media Attachments */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="text-xs font-semibold text-muted" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Site Attachments & Inspection Records
            </span>
            <span className="text-xs text-muted">2 Files</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.625rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8125rem'
              }}
            >
              <ImageIcon size={18} color="var(--primary-blue)" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--dark-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  site-photo-log-01.jpg
                </div>
                <div className="text-xs text-muted">Inspection Photo • 2.4 MB</div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8125rem'
              }}
            >
              <FileText size={18} color="var(--primary-blue)" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--dark-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  facility-schematic-drawing.pdf
                </div>
                <div className="text-xs text-muted">Structural Drawing • 1.1 MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Feedback / Request Action Section */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--primary-blue-border)',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--light-blue)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)', margin: 0 }}>
                  Send Feedback / Request Action
                </h3>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
              style={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              {isFeedbackOpen ? 'Hide Form' : '+ Leave Request'}
            </button>
          </div>

          {/* Quick Action Presets & Input Form */}
          {isFeedbackOpen && (
            <form onSubmit={handleSendFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Presets */}
              <div>
                <span className="text-xs text-muted" style={{ fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Quick Action Templates:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {FEEDBACK_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setFeedbackText(preset)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: feedbackText === preset ? 'var(--primary-blue)' : 'var(--bg-subtle)',
                        color: feedbackText === preset ? '#FFFFFF' : 'var(--text-main)',
                        borderColor: feedbackText === preset ? 'var(--primary-blue)' : 'var(--border-color)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Admin Message / Request Note
                </label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Type an inspection request, delay escalation, or follow-up note..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ fontSize: '0.8125rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsFeedbackOpen(false);
                    setFeedbackText('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!feedbackText.trim()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Send size={13} />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          )}

          {/* Feedback & Request Log History */}
          {(req.adminFeedback && req.adminFeedback.length > 0) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.25rem' }}>
              <div className="text-xs font-semibold text-muted" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Communication & Action History ({req.adminFeedback.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {req.adminFeedback.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.75rem 0.875rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                        <User size={13} color="var(--primary-blue)" />
                        <strong style={{ color: 'var(--dark-navy)' }}>{item.adminName}</strong>
                        <span className="text-muted">• {item.timestamp}</span>
                      </div>
                      <span
                        className={`badge ${item.status === 'Acknowledged' ? 'badge-green' : 'badge-blue'}`}
                        style={{ fontSize: '0.6875rem', padding: '0.15rem 0.5rem' }}
                      >
                        {item.status || 'Sent'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                      "{item.message}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !isFeedbackOpen && (
              <div className="text-xs text-muted" style={{ fontStyle: 'italic' }}>
                No admin requests or feedback recorded yet. Click "+ Leave Request" to notify the team.
              </div>
            )
          )}
        </div>
      </div>

      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          {!isFeedbackOpen && (
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => setIsFeedbackOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <MessageSquare size={14} />
              <span>Send Feedback / Request Action</span>
            </button>
          )}
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setMaintenanceDetailModalRequest(null)}
        >
          Close
        </button>
      </div>
      </div>
    </Modal>
  );
}
