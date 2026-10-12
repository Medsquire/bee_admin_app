import React from 'react';
import {
  LayoutGrid,
  Building2,
  Home,
  UsersRound,
  Briefcase,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export function Sidebar({ currentTab, setCurrentTab, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'residences', label: 'Residences', icon: Home },
    { id: 'rwa', label: 'RWA', icon: UsersRound },
    { id: 'agencys', label: 'Agencys', icon: Briefcase },
    { id: 'security', label: 'Security', icon: ShieldCheck }
  ];

  // Helper to test if item is active
  const isItemActive = (id) => {
    if (id === 'properties') {
      return currentTab === 'properties' || currentTab === 'community';
    }
    if (id === 'residences') {
      return currentTab === 'residences' || currentTab === 'units';
    }
    if (id === 'rwa') {
      return currentTab === 'rwa';
    }
    if (id === 'agencys') {
      return currentTab === 'agencys' || currentTab === 'agencies';
    }
    if (id === 'security') {
      return currentTab === 'security';
    }
    return currentTab === id;
  };

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        background: '#081432',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1.5rem 1.15rem',
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
    >
      {/* 1. BRAND HEADER: Blue square 'B' + BEE AGENCY PORTAL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingLeft: '0.35rem', marginBottom: '0.5rem' }}>
        {/* Blue 'B' Box */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
          }}
        >
          B
        </div>

        {/* Brand Text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.5px',
              color: '#FFFFFF',
              lineHeight: 1.1
            }}
          >
            BEE
          </span>
          <span
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              color: '#768EB8',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            AGENCY PORTAL
          </span>
        </div>
      </div>

      {/* 2. SECTION HEADER: NAVIGATION */}
      <div
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          letterSpacing: '1.2px',
          color: '#5B75A6',
          textTransform: 'uppercase',
          padding: '1.75rem 0.6rem 0.65rem 0.6rem'
        }}
      >
        NAVIGATION
      </div>

      {/* 3. NAVIGATION LINKS */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'properties') {
                  setCurrentTab('properties');
                } else {
                  setCurrentTab(item.id);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.72rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: active ? '#162E63' : 'transparent',
                color: active ? '#FFFFFF' : '#8FA3CB',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: active ? 600 : 500,
                fontSize: '13.5px',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#8FA3CB';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={18} color={active ? '#FFFFFF' : '#8FA3CB'} strokeWidth={active ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </div>

              {/* Glowing cyan dot for active state as in reference image */}
              {active && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#38BDF8',
                    boxShadow: '0 0 6px #38BDF8',
                    flexShrink: 0
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* 4. BOTTOM PROFILE CARD & LOGOUT BUTTON */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '1rem' }}>
        {/* User Card: AD icon + Agency Admin + admin@beeportal.com */}
        <div
          style={{
            background: '#0E1F47',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.75rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {/* Blue 'AD' Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              letterSpacing: '0.5px'
            }}
          >
            AD
          </div>

          {/* User Name & Email */}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: 1.2
              }}
            >
              Agency Admin
            </div>
            <div
              style={{
                fontSize: '10.5px',
                color: '#7088B6',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginTop: '1px'
              }}
            >
              admin@beeportal.com
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            padding: '0.55rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.22)',
            color: '#F87171',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.22)';
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
