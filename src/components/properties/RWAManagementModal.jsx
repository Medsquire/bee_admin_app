import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { hashPassword, getMaskedPassword, generateSecurePassword } from '../../utils/crypto';

export default function RWAManagementModal() {
  const { rwaModalApartmentId, setRwaModalApartmentId, apartments, updateRWA, addToast } = useApp();

  const apartment = apartments.find((a) => a.id === rwaModalApartmentId);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Credentials State for Admin-managed RWA account
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState({
    status: 'Active',
    name: '',
    regNumber: '',
    regDate: '',
    president: '',
    secretary: '',
    treasurer: '',
    contactPhone: '',
    contactEmail: '',
    officeHours: '',
    committee: [],
    credentials: {
      username: '',
      passwordHash: '',
      lastUpdated: '',
      authStatus: 'Active'
    }
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    flat: '',
    phone: ''
  });

  // Track current loaded apartment id to sync form data
  const [loadedApartmentId, setLoadedApartmentId] = useState(null);

  const defaultUser = apartment
    ? `rwa_${(apartment.code || apartment.name).toLowerCase().replace(/[^a-z0-9]/g, '')}`
    : 'rwa_admin';

  if (apartment && apartment.id !== loadedApartmentId) {
    setLoadedApartmentId(apartment.id);
    const existingCreds = apartment.rwa?.credentials || {
      username: defaultUser,
      passwordHash: '$sha256$rwaDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4',
      lastUpdated: '2026-10-25',
      authStatus: 'Active'
    };
    setCustomUsername(existingCreds.username);

    if (apartment.rwa) {
      setFormData({
        status: apartment.rwa.status || 'Active',
        name: apartment.rwa.name || '',
        regNumber: apartment.rwa.regNumber || '',
        regDate: apartment.rwa.regDate || '',
        president: apartment.rwa.president || '',
        secretary: apartment.rwa.secretary || '',
        treasurer: apartment.rwa.treasurer || '',
        contactPhone: apartment.rwa.contactPhone || '',
        contactEmail: apartment.rwa.contactEmail || '',
        officeHours: apartment.rwa.officeHours || '',
        committee: apartment.rwa.committee ? [...apartment.rwa.committee] : [],
        credentials: existingCreds
      });
      setIsEditing(false);
    } else {
      setFormData({
        status: 'Not Registered',
        name: `${apartment.name} Residents' Welfare Association`,
        regNumber: '',
        regDate: '2026-10-25',
        president: '',
        secretary: '',
        treasurer: '',
        contactPhone: '',
        contactEmail: '',
        officeHours: 'Mon - Fri: 09:00 AM - 01:00 PM',
        committee: [],
        credentials: existingCreds
      });
      setIsEditing(true);
    }
  }

  if (!apartment) return null;

  // Safe Close Handler preventing page navigation or apartment de-selection
  const handleCloseModal = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    setRwaModalApartmentId(null);
    setIsEditing(false);
    setIsAddingMember(false);
    setIsChangingPassword(false);
    setPasswordError('');
  };

  const handleSaveRWA = (e) => {
    e.preventDefault();
    updateRWA(apartment.id, formData);
    setIsEditing(false);
    if (addToast) addToast('RWA details updated successfully.', 'success');
  };

  const handleSaveCredentials = async (e) => {
    if (e) e.preventDefault();
    setPasswordError('');
    if (newPassword && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const usernameToSave = customUsername.trim() || formData.credentials?.username || defaultUser;
    let hashToSave = formData.credentials?.passwordHash || '$sha256$rwaDefault$8f49e49c71a39f67a21398bb9d682054a88746c0a0c4';

    if (newPassword) {
      hashToSave = await hashPassword(newPassword);
    }

    const updatedCreds = {
      username: usernameToSave,
      passwordHash: hashToSave,
      lastUpdated: new Date().toISOString().split('T')[0],
      authStatus: 'Active'
    };

    const updatedFormData = {
      ...formData,
      credentials: updatedCreds
    };

    setFormData(updatedFormData);
    updateRWA(apartment.id, updatedFormData);
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    if (addToast) {
      addToast('RWA credentials successfully updated and securely hashed.', 'success');
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    const updatedCommittee = [...formData.committee, newMember];
    setFormData({ ...formData, committee: updatedCommittee });
    updateRWA(apartment.id, { ...formData, committee: updatedCommittee });

    setNewMember({ name: '', role: '', flat: '', phone: '' });
    setIsAddingMember(false);
    if (addToast) addToast('Committee member added.', 'success');
  };

  const handleRemoveMember = (index) => {
    const updatedCommittee = formData.committee.filter((_, i) => i !== index);
    setFormData({ ...formData, committee: updatedCommittee });
    updateRWA(apartment.id, { ...formData, committee: updatedCommittee });
    if (addToast) addToast('Committee member removed.', 'info');
  };

  return (
    <Modal
      isOpen={Boolean(rwaModalApartmentId)}
      onClose={handleCloseModal}
      title={`RWA Administration — ${apartment.name}`}
      subtitle="Residents' Welfare Association governance, executive committee, & bylaws"
      size="lg"
    >
      <div className="modal-body">
        {/* RWA Status Overview */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                {formData.name || `${apartment.name} RWA`}
              </div>
              <div className="text-xs text-muted">
                {formData.regNumber ? `Registration Reg #${formData.regNumber}` : 'Status Pending Registration'}
                {formData.regDate && ` • Registered ${formData.regDate}`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StatusBadge status={formData.status} />
            {!isEditing && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={13} />
                Edit Details
              </button>
            )}
          </div>
        </div>

        {/* View vs Edit Mode for RWA Details */}
        {isEditing ? (
          <form
            onSubmit={handleSaveRWA}
            style={{
              padding: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-blue-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              Edit RWA Association Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Association Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">RWA Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Not Registered">Not Registered</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. RWA-2024-EMR-0892"
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Date of Registration</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.regDate}
                  onChange={(e) => setFormData({ ...formData, regDate: e.target.value })}
                />
              </div>
            </div>

            {/* Principal Office Bearers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
              <div>
                <label className="form-label">President / Chairperson</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={formData.president}
                  onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">General Secretary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={formData.secretary}
                  onChange={(e) => setFormData({ ...formData, secretary: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Treasurer</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={formData.treasurer}
                  onChange={(e) => setFormData({ ...formData, treasurer: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Office Hours</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.officeHours}
                  onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save RWA Details
              </button>
            </div>
          </form>
        ) : (
          /* Read-only Officer Bearers Summary Cards */
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.75rem' }}>
              Principal Executive Officers
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
              <div
                style={{
                  padding: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                  PRESIDENT
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
                  {formData.president || 'Not appointed'}
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                  Head of Society & Executive
                </div>
              </div>

              <div
                style={{
                  padding: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                  GENERAL SECRETARY
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
                  {formData.secretary || 'Not appointed'}
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                  Administration & Minutes
                </div>
              </div>

              <div
                style={{
                  padding: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                  TREASURER
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
                  {formData.treasurer || 'Not appointed'}
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                  Finance, Budgets & Audits
                </div>
              </div>
            </div>

            {/* Association Contact Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem'
              }}
            >
              <div>
                <span className="text-xs text-muted">Direct Phone:</span>{' '}
                <strong style={{ color: 'var(--dark-navy)' }}>{formData.contactPhone || '—'}</strong>
              </div>
              <div>
                <span className="text-xs text-muted">Official Email:</span>{' '}
                <strong style={{ color: 'var(--dark-navy)' }}>{formData.contactEmail || '—'}</strong>
              </div>
              <div>
                <span className="text-xs text-muted">Office Hours:</span>{' '}
                <strong style={{ color: 'var(--dark-navy)' }}>{formData.officeHours || '—'}</strong>
              </div>
            </div>

            {/* RWA Portal Login Credentials & Access Control strictly matching Requirement 5 */}
            <div
              style={{
                marginTop: '1rem',
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
                      RWA Portal Login Credentials & Access Control
                    </div>
                    <div className="text-xs text-muted">
                      Admin-managed authentication for society executive committee login
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-green text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} />
                    {formData.credentials?.authStatus || 'Active'}
                  </span>
                  {!isChangingPassword && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setIsChangingPassword(true);
                        setPasswordError('');
                      }}
                    >
                      <Lock size={13} />
                      Change Password
                    </button>
                  )}
                </div>
              </div>

              {/* Credentials Summary Pill Grid */}
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
                  <span className="text-xs text-muted" style={{ display: 'block' }}>Assigned Username:</span>
                  <strong style={{ color: 'var(--dark-navy)', fontSize: '0.9375rem', fontFamily: 'monospace' }}>
                    {formData.credentials?.username || defaultUser}
                  </strong>
                </div>

                <div>
                  <span className="text-xs text-muted" style={{ display: 'block' }}>Password Status:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ letterSpacing: '2px', color: '#64748B', fontWeight: 700 }}>
                      {getMaskedPassword()}
                    </span>
                    <span className="text-xs text-muted" style={{ fontSize: '0.7rem' }}>
                      (Updated {formData.credentials?.lastUpdated || '2026-10-25'})
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

              {/* Inline Change Password & Edit Credentials Form */}
              {isChangingPassword && (
                <form
                  onSubmit={handleSaveCredentials}
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
                      Change RWA Credentials & Set Password
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const randomPwd = generateSecurePassword();
                        setNewPassword(randomPwd);
                        setConfirmPassword(randomPwd);
                        setShowPassword(true);
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', padding: '0.2rem 0.5rem' }}
                    >
                      <RefreshCw size={12} />
                      Generate Strong Password
                    </button>
                  </div>

                  {passwordError && (
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
                      {passwordError}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-input"
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                        placeholder="e.g. rwa_skyline"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 chars, letters & numbers"
                          style={{ paddingRight: '2.5rem' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                          setIsChangingPassword(false);
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
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

        {/* Committee Members Section */}
        <div>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
                Governing Committee Members ({formData.committee ? formData.committee.length : 0})
              </h3>
              <p className="text-xs text-muted">
                Elected block representatives, sub-committee leads, and area wardens
              </p>
            </div>
            {!isAddingMember && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddingMember(true)}
              >
                <Plus size={14} />
                Add Committee Member
              </button>
            )}
          </div>

          {/* Add Committee Member Inline Form */}
          {isAddingMember && (
            <form
              onSubmit={handleAddMember}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--light-blue)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary-blue-border)',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                NEW COMMITTEE MEMBER ENTRY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Kulkarni"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Committee Role / Lead</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Security & Surveillance Lead"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Resident Flat Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B-304"
                    value={newMember.flat}
                    onChange={(e) => setNewMember({ ...newMember, flat: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAddingMember(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Member
                </button>
              </div>
            </form>
          )}

          {/* Members Table */}
          {(!formData.committee || formData.committee.length === 0) ? (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              No additional committee members registered yet.
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Committee Portfolio / Role</th>
                    <th>Flat #</th>
                    <th>Contact Phone</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.committee.map((member, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                        {member.name}
                      </td>
                      <td>
                        <span className="badge badge-blue">{member.role}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{member.flat || '—'}</td>
                      <td className="text-muted">{member.phone || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon-sm"
                          onClick={() => handleRemoveMember(index)}
                          title="Remove member"
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
