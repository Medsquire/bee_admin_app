import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Building2, Briefcase, Settings, X } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export default function Sidebar() {
  const { activePage, navigateTo, isMobileSidebarOpen, setIsMobileSidebarOpen, metrics } = useApp();

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
          <div
            className="sidebar-logo-icon"
            style={{
              background: '#FFFFFF',
              padding: '2px',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              overflow: 'hidden'
            }}
          >
            <img
              src={logoImg}
              alt="Bee Property Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 'calc(var(--radius-md) - 2px)'
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-brand-name">Bee Property</div>
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

        {/* Navigation List strictly limited to the required pages */}
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
                onClick={() => {
                  navigateTo(item.id);
                  if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
                }}
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
                      backgroundColor: isActive ? 'var(--primary-blue)' : 'var(--bg-subtle)',
                      border: isActive ? 'none' : '1px solid var(--border-color)',
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

        {/* Sidebar Footer: Replaced entire bottom area with a single Settings navigation button */}
        <div className="sidebar-footer" style={{ padding: '0.875rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => {
              navigateTo('settings');
              if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
            }}
            style={{ width: '100%', margin: 0 }}
          >
            <Settings size={18} strokeWidth={activePage === 'settings' ? 2.4 : 2} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
