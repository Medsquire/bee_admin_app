import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Building2, Briefcase, X, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const { activePage, navigateTo, isMobileSidebarOpen, setIsMobileSidebarOpen, metrics, currentUser } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building2,
      badge: metrics.totalApartments
    },
    {
      id: 'agencies',
      label: 'Agencies',
      icon: Briefcase,
      badge: metrics.activeAgencies
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-backdrop ${isMobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
              <path d="M12 22V12" />
              <path d="M20 7l-8 5-8-5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-brand-name">BEE Residence</div>
            <div className="sidebar-brand-subtitle">Admin Portal</div>
          </div>
          {isMobileSidebarOpen && (
            <button
              type="button"
              className="btn btn-ghost btn-icon-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation List strictly limited to the 3 required pages */}
        <nav className="sidebar-nav">
          <div
            className="text-xs font-semibold"
            style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.5rem 0.5rem' }}
          >
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigateTo(item.id)}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge !== null && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'var(--primary-blue)' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Admin Profile Details & System Status */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Admin Profile Section matching navbar profile style */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                flexShrink: 0
              }}
            >
              {currentUser?.initials || 'SJ'}
            </div>
            <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--dark-navy)',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentUser?.name || 'Sarah Jenkins'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--primary-blue)',
                  fontWeight: 600,
                  marginTop: '0.1rem'
                }}
              >
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
          </div>

          {/* System Status Section below it */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                System Status
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                All Systems Normal
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
