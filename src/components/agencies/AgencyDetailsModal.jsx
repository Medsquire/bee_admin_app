import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  User,
  Wrench,
  FileText,
  Shield,
  Layers,
  Clock,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { hashPassword, getMaskedPassword, generateSecurePassword } from '../../utils/crypto';

export default function AgencyDetailsModal() {
  const {
    agencyDetailModalId,
    setAgencyDetailModalId,
    agencies,
    updateAgency,
    addToast,
    setAgencyOnboardingModal,
    setPropertyAssignmentModal,
    setRegistrationReviewModal,
    setAssignmentApprovalModal,
    setPersonnelModal,
    deleteAgencyPersonnel
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // overview, company, services, personnel, documents, assignments, history

  // Portal Account Credentials State
  const [isChangingAgencyPassword, setIsChangingAgencyPassword] = useState(false);
  const [agencyNewPassword, setAgencyNewPassword] = useState('');
  const [agencyConfirmPassword, setAgencyConfirmPassword] = useState('');
  const [showAgencyPassword, setShowAgencyPassword] = useState(false);
  const [agencyCustomUser, setAgencyCustomUser] = useState('');
  const [agencyPwdError, setAgencyPwdError] = useState('');

  const agency = agencies.find((a) => a.id === agencyDetailModalId);

  if (!agency) return null;

  const isPendingRegistration =
    agency.registrationStatus === 'Submitted' || agency.registrationStatus === 'Under Review';

  const pendingAssignments = (agency.propertyAssignments || []).filter(
    (pa) => pa.status === 'Submitted for Approval' || pa.status === 'Under Review'
  );

  const defaultAgencyUser = `partner_${(agency.code || agency.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const handleUpdateAgencyCredentials = async (e) => {
    if (e) e.preventDefault();
    setAgencyPwdError('');
    if (agencyNewPassword && agencyNewPassword.length < 8) {
      setAgencyPwdError('Password must be at least 8 characters long.');
      return;
    }
    if (agencyNewPassword && agencyNewPassword !== agencyConfirmPassword) {
      setAgencyPwdError('Passwords do not match.');
      return;
    }

    let hash = agency.credentials?.passwordHash || '$sha256$partnerDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4';
    if (agencyNewPassword) {
      hash = await hashPassword(agencyNewPassword);
    }

    const updatedCreds = {
      username: agencyCustomUser.trim() || agency.credentials?.username || defaultAgencyUser,
      passwordHash: hash,
      lastUpdated: new Date().toISOString().split('T')[0],
      authStatus: 'Active'
    };

    updateAgency(agency.id, {
      ...agency,
      credentials: updatedCreds
    });

    setIsChangingAgencyPassword(false);
    setAgencyNewPassword('');
    setAgencyConfirmPassword('');
    if (addToast) addToast('Agency login credentials successfully updated and secured.', 'success');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'company', label: 'Company Info', icon: FileText },
    { id: 'services', label: `Services (${agency.services?.length || agency.categories?.length || 0})`, icon: Wrench },
    { id: 'personnel', label: `Personnel (${agency.personnel?.length || agency.totalPersonnel || 0})`, icon: User },
    { id: 'documents', label: `Documents (${agency.documents?.length || 0})`, icon: FileText },
    { id: 'assignments', label: `Assignments (${agency.propertyAssignments?.length || 0})`, icon: Layers },
    { id: 'history', label: 'Approval History', icon: Clock }
  ];

  return (
    <Modal
      isOpen={Boolean(agencyDetailModalId)}
      onClose={() => setAgencyDetailModalId(null)}
      title={agency.name}
      subtitle={`Service Partner • Ref: ${agency.registrationRefNumber || 'N/A'}`}
      size="xl"
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '82vh' }}>
        {/* Top Header Card */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
                border: '1px solid var(--primary-blue-border)'
              }}
            >
              {agency.logoText}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                  {agency.name}
                </span>
                <StatusBadge status={agency.registrationStatus || 'Approved for Property Assignment'} />
                <StatusBadge status={agency.availabilityStatus} />
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                Primary Service: <strong>{agency.category}</strong> • Contact: {agency.contactPerson} ({agency.phone})
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isPendingRegistration && (
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={() => setRegistrationReviewModal({ isOpen: true, agencyId: agency.id })}
              >
                <Shield size={14} />
                Review Registration
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setPropertyAssignmentModal({ isOpen: true, agencyId: agency.id })}
            >
              <Plus size={14} />
              Request Assignment
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setAgencyOnboardingModal({ isOpen: true, mode: 'edit', agencyId: agency.id })}
            >
              <Edit2 size={14} />
              Edit
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            overflowX: 'auto',
            padding: '0.25rem 0.75rem',
            gap: '0.35rem'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  padding: '0.4rem 0.75rem'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* TAB 1: OVERVIEW strictly matching PRD Section 5.I */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Metric Counters Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.75rem'
                }}
              >
                <div style={{ padding: '0.875rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div className="text-xs text-muted font-semibold">Total Staff</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                    {agency.totalPersonnel}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>Allocated</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                    {agency.allocatedPersonnel}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: '#DCFCE7', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Available</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                    {agency.availablePersonnel}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A', textAlign: 'center' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>On Leave</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
                    {agency.onLeavePersonnel || 0}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div className="text-xs text-muted font-semibold">Active Jobs</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                    {agency.activeAssignmentsCount || 0}
                  </div>
                </div>
              </div>

              {/* Pending Approvals Notice if any */}
              {pendingAssignments.length > 0 && (
                <div style={{ padding: '0.875rem 1rem', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E40AF' }}>
                      Pending Property Assignment Review ({pendingAssignments.length})
                    </div>
                    <div className="text-xs text-muted">
                      {pendingAssignments[0].propertyName} requested access for {pendingAssignments[0].requestedServices.join(', ')}
                    </div>
                  </div>
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
                  >
                    Review Assignment
                  </button>
                </div>
              )}

              {/* Company & Liaison Snapshot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>
                    PRIMARY CONTACT & LIAISON
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.9375rem' }}>
                    {agency.contactPerson}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    {agency.agent?.designation || 'Operations Director'} • {agency.phone}
                  </div>
                  <div className="text-xs text-muted">
                    {agency.email}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="text-xs font-semibold text-muted" style={{ marginBottom: '0.5rem' }}>
                    SERVICE CAPABILITY SCOPE
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {(agency.categories || []).map((cat) => (
                      <span key={cat} className="badge badge-blue">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    Contract: {agency.agreementStatus}
                  </div>
                </div>
              </div>

              {/* Agency Portal Credentials & Access Control strictly matching Requirement 5 */}
              <div
                style={{
                  padding: '1.15rem 1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid #DBEAFE',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-blue)'
                      }}
                    >
                      <Key size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                        Agency Portal Login Credentials & Access Control
                      </div>
                      <div className="text-xs text-muted">
                        Admin-managed authentication for service partner operational portal
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-green text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} />
                      {agency.credentials?.authStatus || 'Active'}
                    </span>
                    {!isChangingAgencyPassword && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setIsChangingAgencyPassword(true);
                          setAgencyCustomUser(agency.credentials?.username || defaultAgencyUser);
                          setAgencyPwdError('');
                        }}
                      >
                        <Lock size={13} />
                        Change Password
                      </button>
                    )}
                  </div>
                </div>

                {/* Credentials Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div>
                    <span className="text-xs text-muted" style={{ display: 'block' }}>Assigned Portal Username:</span>
                    <strong style={{ color: 'var(--dark-navy)', fontSize: '0.9375rem', fontFamily: 'monospace' }}>
                      {agency.credentials?.username || defaultAgencyUser}
                    </strong>
                  </div>

                  <div>
                    <span className="text-xs text-muted" style={{ display: 'block' }}>Password Status:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ letterSpacing: '2px', color: '#64748B', fontWeight: 700 }}>
                        {getMaskedPassword()}
                      </span>
                      <span className="text-xs text-muted" style={{ fontSize: '0.7rem' }}>
                        (Updated {agency.credentials?.lastUpdated || '2026-10-25'})
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted" style={{ display: 'block' }}>Security Standard:</span>
                    <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
                      Salted SHA-256 Digest
                    </span>
                  </div>
                </div>

                {/* Inline Change Agency Password Form */}
                {isChangingAgencyPassword && (
                  <form
                    onSubmit={handleUpdateAgencyCredentials}
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#EFF6FF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #BFDBFE',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E40AF' }}>
                        Change Partner Credentials & Set Password
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          const randomPwd = generateSecurePassword();
                          setAgencyNewPassword(randomPwd);
                          setAgencyConfirmPassword(randomPwd);
                          setShowAgencyPassword(true);
                        }}
                        style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', padding: '0.2rem 0.5rem' }}
                      >
                        <RefreshCw size={12} />
                        Generate Strong Password
                      </button>
                    </div>

                    {agencyPwdError && (
                      <div
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          color: 'var(--error)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <AlertCircle size={13} />
                        {agencyPwdError}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label">Portal Username</label>
                        <input
                          type="text"
                          className="form-input"
                          value={agencyCustomUser}
                          onChange={(e) => setAgencyCustomUser(e.target.value)}
                          placeholder="e.g. partner_apex"
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">New Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showAgencyPassword ? 'text' : 'password'}
                            className="form-input"
                            value={agencyNewPassword}
                            onChange={(e) => setAgencyNewPassword(e.target.value)}
                            placeholder="Min 8 chars, letters & numbers"
                            style={{ paddingRight: '2.5rem' }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowAgencyPassword(!showAgencyPassword)}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748B'
                            }}
                          >
                            {showAgencyPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Confirm Password</label>
                        <input
                          type={showAgencyPassword ? 'text' : 'password'}
                          className="form-input"
                          value={agencyConfirmPassword}
                          onChange={(e) => setAgencyConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#1E40AF' }}>
                        🔒 Security Standard: Password will be cryptographically hashed via salted SHA-256 before storage.
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setIsChangingAgencyPassword(false);
                            setAgencyNewPassword('');
                            setAgencyConfirmPassword('');
                            setAgencyPwdError('');
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          <CheckCircle2 size={14} />
                          Update Credentials
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY INFORMATION strictly matching PRD Section 5.I */}
          {activeTab === 'company' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <span className="text-xs text-muted">Registered Company Name:</span>
                  <div style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
                    {agency.company?.registeredCompanyName || agency.name}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted">Business Type:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.businessType || 'Private Limited Company'}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">Registration Number:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.registrationNumber || 'REG-2024-8891'}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">GSTIN:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.gstin || '27AABCU9603R1Z5'}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">Corporate PAN:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.pan || 'AABCU9603R'}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">Established:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.yearOfEstablishment || 2018}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">Company Phone:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.companyPhone || agency.phone}</div>
                </div>

                <div>
                  <span className="text-xs text-muted">Company Email:</span>
                  <div style={{ fontWeight: 600 }}>{agency.company?.companyEmail || agency.email}</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span className="text-xs text-muted">Office Address:</span>
                  <div style={{ fontWeight: 600 }}>
                    {agency.company?.addressLine1 || '100 Service Boulevard'}, {agency.company?.city || 'Emerald City'}, {agency.company?.state || 'CA'} - {agency.company?.pinCode || '94016'}, {agency.company?.country || 'United States'}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span className="text-xs text-muted">Company Description:</span>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {agency.company?.description || 'Authorized residential facility operations and service partner.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES OFFERED strictly matching PRD Section 5.I */}
          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(agency.services || []).map((srv) => (
                <div
                  key={srv.id || srv.category}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                      {srv.category} {srv.otherServiceName && `(${srv.otherServiceName})`}
                    </div>
                    <span className="badge badge-blue">{srv.availability || 'Standard Shift'}</span>
                  </div>
                  <div className="text-xs text-muted">
                    Specialization: <strong>{srv.specialization}</strong> • Experience: <strong>{srv.experienceYears} years</strong>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {srv.description}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    Certifications: {srv.certifications} • Area Coverage: {srv.coverageArea}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PERSONNEL MANAGEMENT strictly matching PRD Section 5.I & 5.F */}
          {activeTab === 'personnel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    Personnel Roster ({(agency.personnel || []).length} registered)
                  </h3>
                  <p className="text-xs text-muted">Track technicians, guards, shifts, and job status</p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setPersonnelModal({ isOpen: true, agencyId: agency.id, personnel: null })}
                >
                  <Plus size={14} />
                  Add Staff Member
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(agency.personnel || []).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-blue)',
                          color: 'var(--primary-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}
                      >
                        {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
                          {p.name}
                        </div>
                        <div className="text-xs text-muted">
                          {p.role} • {p.experience} exp • {p.phone}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-xs font-semibold" style={{ color: p.status === 'Assigned' ? 'var(--primary-blue)' : 'var(--success)' }}>
                          {p.status}
                        </div>
                        <div className="text-xs text-muted">{p.currentShift}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setPersonnelModal({ isOpen: true, agencyId: agency.id, personnel: p })}
                          title="Edit Staff"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => deleteAgencyPersonnel(agency.id, p.id)}
                          title="Remove Staff"
                        >
                          <Trash2 size={13} color="var(--error)" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS strictly matching PRD Section 5.I */}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {(agency.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={20} color="var(--primary-blue)" />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
                        {doc.documentType}
                      </div>
                      <div className="text-xs text-muted">
                        File: {doc.fileName} • Uploaded: {doc.uploadDate} {doc.expiryDate ? `• Expires: ${doc.expiryDate}` : ''}
                      </div>
                      {doc.remarks && <div className="text-xs text-secondary">{doc.remarks}</div>}
                    </div>
                  </div>

                  <span className="badge badge-green">
                    {doc.verificationStatus || 'Verified'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: PROPERTY ASSIGNMENTS strictly matching PRD Section 5.I & 5.G */}
          {activeTab === 'assignments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                    Property Assignments ({(agency.propertyAssignments || []).length})
                  </h3>
                  <p className="text-xs text-muted">Access permissions to communities, towers, and approved services</p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setPropertyAssignmentModal({ isOpen: true, agencyId: agency.id })}
                >
                  <Plus size={14} />
                  + Request Property Assignment
                </button>
              </div>

              {(agency.propertyAssignments || []).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                  <div className="text-xs text-muted">No property assignments requested yet.</div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setPropertyAssignmentModal({ isOpen: true, agencyId: agency.id })}
                    style={{ marginTop: '0.5rem' }}
                  >
                    Request First Property Assignment
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {agency.propertyAssignments.map((pa) => {
                    const isPending = pa.status === 'Submitted for Approval' || pa.status === 'Under Review';
                    return (
                      <div
                        key={pa.id}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-md)',
                          border: isPending ? '1px solid #BFDBFE' : '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--dark-navy)' }}>
                              {pa.propertyName} ({pa.propertyCode})
                            </div>
                            <div className="text-xs text-muted">
                              Type: {pa.assignmentType} • Timeline: {pa.startDate} to {pa.endDate || 'Active'}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <StatusBadge status={pa.status} />
                            {isPending && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  setAssignmentApprovalModal({
                                    isOpen: true,
                                    agencyId: agency.id,
                                    assignmentId: pa.id
                                  })
                                }
                              >
                                Review Request
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-muted">Approved Services: </span>
                          <span className="text-xs" style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>
                            {(pa.approvedServices?.length > 0 ? pa.approvedServices : pa.requestedServices || []).join(', ')}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-muted">Approved Towers: </span>
                          <span className="text-xs" style={{ color: 'var(--dark-navy)' }}>
                            {(pa.approvedBlocks?.length > 0 ? pa.approvedBlocks : pa.assignedBlocks || []).join(', ')}
                          </span>
                        </div>

                        {pa.comments && (
                          <div className="text-xs" style={{ backgroundColor: '#F8FAFC', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                            Admin remarks: {pa.comments}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: APPROVAL HISTORY strictly matching PRD Section 5.I */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(agency.approvalHistory || []).map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <CheckCircle2 size={16} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
                        Decision: {h.decision}
                      </span>
                      <span className="text-xs text-muted">{h.timestamp}</span>
                    </div>

                    <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                      Reviewer: <strong>{h.reviewer}</strong> • Action: {h.type}
                    </div>

                    {h.comments && (
                      <div className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Remarks: {h.comments}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setAgencyDetailModalId(null)}
          >
            Close
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setAgencyDetailModalId(null);
                setPropertyAssignmentModal({ isOpen: true, agencyId: agency.id });
              }}
            >
              <Plus size={15} />
              + Request Property Assignment
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
