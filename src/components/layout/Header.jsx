import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Menu, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Wrench, X, LogOut, ChevronDown } from 'lucide-react';

export default function Header() {
  const {
    activePage,
    navigateTo,
    globalSearchQuery,
    setGlobalSearchQuery,
    setIsMobileSidebarOpen,
    activities,
    apartments,
    agencies,
    maintenanceRequests,
    currentUser,
    logout
  } = useApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time overview of apartments, occupancy, agencies, and maintenance'
    },
    properties: {
      title: 'Properties & Communities',
      subtitle: 'Hierarchical navigation of apartments, blocks, floors, and residences'
    },
    agencies: {
      title: 'Agencies & Service Providers',
      subtitle: 'Service allocation, personnel roster, and availability scheduling'
    }
  };

  const currentMeta = pageTitles[activePage] || pageTitles.dashboard;

  // Search Results Filtering
  const searchResults = React.useMemo(() => {
    if (!globalSearchQuery || globalSearchQuery.trim().length < 2) return null;
    const query = globalSearchQuery.toLowerCase().trim();

    const matchedApartments = apartments.filter(
      (a) => a.name.toLowerCase().includes(query) || a.city.toLowerCase().includes(query)
    );

    const matchedAgencies = agencies.filter(
      (ag) => ag.name.toLowerCase().includes(query) || ag.category.toLowerCase().includes(query)
    );

    const matchedMaintenance = maintenanceRequests.filter(
      (m) => m.title.toLowerCase().includes(query) || m.apartmentName.toLowerCase().includes(query)
    );

    return {
      apartments: matchedApartments,
      agencies: matchedAgencies,
      maintenance: matchedMaintenance
    };
  }, [globalSearchQuery, apartments, agencies, maintenanceRequests]);

  const hasResults =
    searchResults &&
    (searchResults.apartments.length > 0 ||
      searchResults.agencies.length > 0 ||
      searchResults.maintenance.length > 0);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <Wrench size={14} color="#2563EB" />;
      case 'maintenance':
        return <AlertTriangle size={14} color="#D97706" />;
      case 'security':
        return <ShieldCheck size={14} color="#16A34A" />;
      case 'rwa':
        return <FileText size={14} color="#6366F1" />;
      default:
        return <CheckCircle2 size={14} color="#16A34A" />;
    }
  };

  return (
    <header className="header">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="header-left">
        <button
          type="button"
          className="btn btn-ghost btn-icon-only"
          onClick={() => setIsMobileSidebarOpen(true)}
          style={{ display: 'none' }}
          id="mobile-nav-toggle"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-navy)', margin: 0 }}>
            {currentMeta.title}
          </h1>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #mobile-nav-toggle {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .header-search-box {
            display: none !important;
          }
        }
      `}</style>

      {/* Right: Search, Notifications, Admin Profile */}
      <div className="header-right">
        {/* Global Search Input */}
        <div className="search-wrapper header-search-box" ref={searchRef} style={{ width: '280px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search communities, tickets, agencies..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            style={{ width: '100%' }}
          />
          {globalSearchQuery && (
            <button
              type="button"
              className="btn btn-ghost btn-icon-sm"
              onClick={() => setGlobalSearchQuery('')}
              style={{ position: 'absolute', right: '0.4rem', height: '24px', width: '24px', padding: 0 }}
            >
              <X size={12} />
            </button>
          )}

          {/* Search Dropdown Modal */}
          {isSearchFocused && searchResults && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '360px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 60,
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '0.75rem'
              }}
            >
              {!hasResults ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                  No matching results for "{globalSearchQuery}"
                </div>
              ) : (
                <div>
                  {searchResults.apartments.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div className="text-xs font-semibold text-muted" style={{ padding: '0.25rem 0.5rem' }}>
                        Apartments
                      </div>
                      {searchResults.apartments.map((apt) => (
                        <div
                          key={apt.id}
                          style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          className="nav-item"
                          onClick={() => {
                            navigateTo('properties', { apartmentId: apt.id });
                            setIsSearchFocused(false);
                            setGlobalSearchQuery('');
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{apt.name}</span>
                          <span className="text-xs text-muted">({apt.city})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.agencies.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div className="text-xs font-semibold text-muted" style={{ padding: '0.25rem 0.5rem' }}>
                        Agencies
                      </div>
                      {searchResults.agencies.map((ag) => (
                        <div
                          key={ag.id}
                          style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          className="nav-item"
                          onClick={() => {
                            navigateTo('agencies');
                            setIsSearchFocused(false);
                            setGlobalSearchQuery('');
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{ag.name}</span>
                          <span className="text-xs text-muted">{ag.category}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.maintenance.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-muted" style={{ padding: '0.25rem 0.5rem' }}>
                        Maintenance Tickets
                      </div>
                      {searchResults.maintenance.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                          className="nav-item"
                          onClick={() => {
                            navigateTo('properties', { apartmentId: m.apartmentId, tab: 'maintenance' });
                            setIsSearchFocused(false);
                            setGlobalSearchQuery('');
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{m.title}</div>
                          <div className="text-xs text-muted">
                            {m.apartmentName} • {m.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <button
            type="button"
            className="btn btn-ghost btn-icon-only"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            style={{ position: 'relative' }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                boxShadow: '0 0 0 2px #FFFFFF'
              }}
            />
          </button>

          {isNotificationOpen && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 60,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
                  Notifications
                </div>
                <span className="badge badge-blue">Recent</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ marginTop: '0.2rem' }}>{getActivityIcon(act.type)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                        {act.title}
                      </div>
                      <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                        {act.description}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {act.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill & Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            aria-label="Admin profile options"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isProfileOpen ? '#EFF6FF' : '#F8FAFC',
              border: isProfileOpen ? '1px solid var(--primary-blue)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isProfileOpen) {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.borderColor = 'var(--primary-blue-border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProfileOpen) {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
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
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
              }}
            >
              {currentUser?.initials || 'SJ'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--dark-navy)', lineHeight: 1.2 }}>
                {currentUser?.name || 'Sarah Jenkins'}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown
              size={14}
              style={{
                color: 'var(--text-muted)',
                transform: isProfileOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform var(--transition-fast)',
                marginLeft: '0.15rem'
              }}
            />
          </button>

          {/* Profile Popover / Dropdown */}
          {isProfileOpen && (
            <div
              className="card glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                width: '230px',
                zIndex: 1000,
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              {/* Admin Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                    flexShrink: 0
                  }}
                >
                  {currentUser?.initials || 'SJ'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--dark-navy)', lineHeight: 1.2 }}>
                    {currentUser?.name || 'Sarah Jenkins'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--primary-blue)', fontWeight: 600, marginTop: '0.15rem' }}>
                    {currentUser?.role || 'Super Admin'}
                  </div>
                </div>
              </div>

              {/* Action / Logout */}
              <div style={{ paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--error)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--error-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
