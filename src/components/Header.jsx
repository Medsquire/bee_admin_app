import React, { useState } from 'react';
import {
  SquarePen,
  X,
  Check,
  ShieldCheck,
  User,
  Mail,
  Phone
} from 'lucide-react';

export function Header({
  currentTab = 'dashboard',
  addToast = () => {}
}) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Agency Administrator',
    role: 'Administrator',
    email: 'admin@beeportal.com',
    phone: '+1 (555) 019-2834'
  });

  // Dynamic breadcrumb section name based on active tab
  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'community':
      case 'properties':
        return 'Properties';
      case 'residences':
      case 'units':
        return 'Residences';
      case 'rwa':
        return 'RWA';
      case 'agencys':
      case 'agencies':
        return 'Agencys';
      case 'security':
        return 'Security';
      case 'services':
      case 'maintenance':
        return 'Services';
      case 'technicians':
      case 'tenants':
        return 'Technicians';
      case 'financials':
        return 'Payment Records';
      case 'reports':
      case 'theme-guide':
        return 'Reports';
      default:
        return 'Dashboard';
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditProfileOpen(false);
    addToast('Profile Updated', 'Administrator profile changes saved successfully.', 'success');
  };

  return (
    <>
      <header
        style={{
          height: '66px',
          background: '#081432',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxSizing: 'border-box'
        }}
      >
        {/* Left Side: BEE Property Management / Section Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '13.5px' }}>
          <span style={{ color: '#8FA3CB', fontWeight: 500 }}>
            BEE Property Management
          </span>
          <span style={{ color: '#5B75A6', margin: '0 10px', fontWeight: 400 }}>
            /
          </span>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>
            {getBreadcrumbTitle()}
          </span>
        </div>

        {/* Right Side: Agency Administrator Profile Box + Edit Profile Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Administrator Profile Card: Blue 'A' box + Agency Administrator / Administrator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Blue 'A' Badge */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                fontFamily: "'Outfit', sans-serif",
                flexShrink: 0
              }}
            >
              A
            </div>

            {/* Profile Text Block */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span
                style={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  lineHeight: 1.2
                }}
              >
                {profileData.name}
              </span>
              <span
                style={{
                  color: '#7B93BE',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  marginTop: '1px'
                }}
              >
                {profileData.role}
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditProfileOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <SquarePen size={13} color="#FFFFFF" />
            <span>Edit Profile</span>
          </button>
        </div>
      </header>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditProfileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 11, 20, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '460px',
              maxWidth: '100%',
              background: '#0B1B3D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 800 }}>
                  A
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700, margin: 0 }}>
                  Edit Administrator Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="btn-icon"
                style={{ width: '30px', height: '30px' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#8FA3CB', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#768EB8' }} />
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#8FA3CB', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                  Role / Title
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#768EB8' }} />
                  <input
                    type="text"
                    required
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#8FA3CB', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#768EB8' }} />
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#8FA3CB', marginBottom: '4px', display: 'block', fontWeight: 600 }}>
                  Direct Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#768EB8' }} />
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Check size={14} /> Save Profile
                </button>
              </div>
            </form>
          </div>
       </div>
      )}
    </>
  );
}

export default Header;
