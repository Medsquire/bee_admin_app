import React, { useState, useMemo } from 'react';
import {
  Home,
  Building2,
  Users,
  Search,
  Filter,
  Plus,
  Key,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  DoorClosed,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Car,
  Clock,
  Layers,
  X,
  Send
} from 'lucide-react';
import { INITIAL_COMMUNITY_FLATS, APARTMENT_TEMPLATES } from '../data/communityData';

export function ResidencesScreen({
  apartments: propApartments,
  setApartments: propSetApartments,
  flats: propFlats,
  setFlats: propSetFlats,
  onNavigateTab = () => {},
  onOpenWorkOrderModal = () => {},
  addToast = () => {}
}) {
  const [internalApartments, setInternalApartments] = useState(() => {
    try {
      const saved = localStorage.getItem('bee_apartments');
      return saved ? JSON.parse(saved) : APARTMENT_TEMPLATES;
    } catch {
      return APARTMENT_TEMPLATES;
    }
  });
  const apartments = propApartments || internalApartments;
  const setApartments = propSetApartments || setInternalApartments;

  const [internalFlats, setInternalFlats] = useState(() => {
    try {
      const saved = localStorage.getItem('bee_community_flats');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_FLATS;
    } catch {
      return INITIAL_COMMUNITY_FLATS;
    }
  });
  const flats = propFlats || internalFlats;
  const setFlats = propSetFlats || setInternalFlats;

  const [selectedApartment, setSelectedApartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBhk, setSelectedBhk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  // Handler: Apply Hierarchy
  const handleApplyHierarchy = ({ apartments: newApts, flats: newFlats, mode }) => {
    if (mode === 'replace') {
      setApartments(newApts);
      setFlats(newFlats);
      try {
        localStorage.setItem('bee_apartments', JSON.stringify(newApts));
        localStorage.setItem('bee_community_flats', JSON.stringify(newFlats));
      } catch (err) {
        console.warn(err);
      }
    } else {
      const mergedApts = [...apartments, ...newApts];
      const mergedFlats = [...flats, ...newFlats];
      setApartments(mergedApts);
      setFlats(mergedFlats);
      try {
        localStorage.setItem('bee_apartments', JSON.stringify(mergedApts));
        localStorage.setItem('bee_community_flats', JSON.stringify(mergedFlats));
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Filtering logic
  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      if (selectedApartment !== 'all' && flat.apartmentId !== selectedApartment) return false;
      if (selectedStatus !== 'all' && flat.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (selectedBhk !== 'all' && !flat.bhk.toLowerCase().includes(selectedBhk.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesFlat = flat.flatNumber.toLowerCase().includes(q);
        const matchesName = flat.resident?.name?.toLowerCase().includes(q);
        const matchesBlock = flat.blockId.toLowerCase().includes(q);
        const matchesType = flat.bhk.toLowerCase().includes(q);
        if (!matchesFlat && !matchesName && !matchesBlock && !matchesType) return false;
      }
      return true;
    });
  }, [flats, selectedApartment, selectedStatus, selectedBhk, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = flats.length;
    const occupied = flats.filter(f => f.status === 'Occupied').length;
    const vacant = flats.filter(f => f.status === 'Vacant').length;
    const maintenance = flats.filter(f => f.status === 'Maintenance').length;
    const reserved = flats.filter(f => f.status === 'Reserved').length;
    const occupancyRate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;
    return { total, occupied, vacant, maintenance, reserved, occupancyRate };
  }, [flats]);

  const handleSendNotice = (e) => {
    e.preventDefault();
    if (!noticeMessage.trim()) return;
    addToast('Notice Transmitted', `Instant push notification sent to ${selectedFlat?.resident?.name || 'Resident'} (${selectedFlat?.flatNumber})`, 'success');
    setIsNoticeModalOpen(false);
    setNoticeMessage('');
  };

  const getApartmentName = (aptId) => {
    const apt = apartments.find(a => a.id === aptId);
    return apt ? apt.name : aptId;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Occupied':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', color: '#34D399', label: 'Occupied' };
      case 'Vacant':
        return { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', color: '#60A5FA', label: 'Vacant Ready' };
      case 'Maintenance':
        return { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)', color: '#F87171', label: 'Maintenance' };
      case 'Reserved':
        return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: '#FBBF24', label: 'Reserved' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)', color: '#94A3B8', label: status };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                color: '#60A5FA',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              RESIDENCE MANAGEMENT
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>144 Master Residential Flats</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Residences Directory & Unit Master
          </h1>
          <p style={{ margin: '0.3rem 0 0', color: '#8FA3CB', fontSize: '13.5px' }}>
            Complete residential flat inventory, occupant profiles, lease tenures, and unit telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab('properties')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Layers size={14} /> Open Hierarchy Builder (In Properties)
          </button>

          {/* View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0B1633', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? '#1D4ED8' : 'transparent',
              color: viewMode === 'grid' ? '#FFFFFF' : '#8FA3CB',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Grid Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'table' ? '#1D4ED8' : 'transparent',
              color: viewMode === 'table' ? '#FFFFFF' : '#8FA3CB',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Detailed Ledger
          </button>
        </div>
      </div>
    </div>

      {/* 2. KPI Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>TOTAL FLATS</span>
            <Building2 size={16} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Across 3 Complexes & 9 Blocks</div>
        </div>

        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>OCCUPANCY RATE</span>
            <Users size={16} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            {stats.occupancyRate}%
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>{stats.occupied} occupied flats</div>
        </div>

        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>VACANT READY</span>
            <DoorClosed size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            {stats.vacant}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>Available for immediate lease</div>
        </div>

        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>
            <span>UNDER TURNOVER</span>
            <AlertCircle size={16} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FBBF24', marginTop: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
            {stats.maintenance + stats.reserved}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '0.2rem' }}>{stats.maintenance} punchlist • {stats.reserved} reserved</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div
        style={{
          background: '#091536',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 280px', position: 'relative' }}>
          <Search size={16} color="#768EB8" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search flat number, resident name, block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#060E24',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {/* Complex Filter */}
          <select
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            style={{
              background: '#060E24',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              color: '#FFFFFF',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Complexes</option>
            {apartments.map(apt => (
              <option key={apt.id} value={apt.id}>{apt.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: '#060E24',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              color: '#FFFFFF',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>

          {/* BHK Filter */}
          <select
            value={selectedBhk}
            onChange={(e) => setSelectedBhk(e.target.value)}
            style={{
              background: '#060E24',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              color: '#FFFFFF',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Unit Configurations</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>
      </div>

      {/* 4. Display Content: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.1rem' }}>
          {filteredFlats.map((flat) => {
            const statusBadge = getStatusBadge(flat.status);
            return (
              <div
                key={flat.id}
                style={{
                  background: '#091536',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Top: Flat # & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: '#1D4ED8',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      {flat.flatNumber}
                    </div>
                    <div>
                      <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px' }}>
                        Flat {flat.flatNumber}
                      </div>
                      <div style={{ color: '#768EB8', fontSize: '11px' }}>
                        Floor {flat.floor} • {flat.blockId}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: statusBadge.bg,
                      border: `1px solid ${statusBadge.border}`,
                      color: statusBadge.color,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Sub info: Complex and BHK */}
                <div style={{ background: '#060E24', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#768EB8' }}>Complex</span>
                    <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{getApartmentName(flat.apartmentId)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '0.35rem' }}>
                    <span style={{ color: '#768EB8' }}>Layout</span>
                    <span style={{ color: '#60A5FA', fontWeight: 600 }}>{flat.bhk} ({flat.sqft} sq.ft)</span>
                  </div>
                </div>

                {/* Resident Profile / Vacant State */}
                {flat.resident ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.2rem' }}>
                    <img
                      src={flat.resident.avatar}
                      alt={flat.resident.name}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#FFFFFF', fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {flat.resident.name}
                      </div>
                      <div style={{ color: '#768EB8', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Lease to {flat.leaseEnd}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '12px', fontStyle: 'italic', padding: '0.35rem 0' }}>
                    <Key size={14} color="#60A5FA" />
                    <span>Unit vacant — ready for lease inspection</span>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    onClick={() => setSelectedFlat(flat)}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View File
                  </button>
                  {flat.resident && (
                    <button
                      onClick={() => {
                        setSelectedFlat(flat);
                        setIsNoticeModalOpen(true);
                      }}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(37, 99, 235, 0.15)',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        color: '#60A5FA',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Mail size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => onOpenWorkOrderModal(flat.flatNumber)}
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#FBBF24',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Dispatch Work Order"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: '#060E24', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#8FA3CB' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Flat #</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Complex & Block</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Layout / Sq.Ft</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Occupant</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Lease End</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Rent / Mth</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlats.map((flat) => {
                  const statusBadge = getStatusBadge(flat.status);
                  return (
                    <tr
                      key={flat.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#FFFFFF' }}>
                        Flat {flat.flatNumber}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#CBD5E1' }}>
                        <div>{getApartmentName(flat.apartmentId)}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{flat.blockId} • Floor {flat.floor}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#94A3B8' }}>
                        {flat.bhk} <span style={{ color: '#64748B' }}>({flat.sqft} sqft)</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {flat.resident ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={flat.resident.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{flat.resident.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748B', fontStyle: 'italic' }}>— Vacant —</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#94A3B8' }}>
                        {flat.leaseEnd || '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#60A5FA', fontWeight: 600 }}>
                        ${flat.rent?.toLocaleString() || '2,400'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            background: statusBadge.bg,
                            border: `1px solid ${statusBadge.border}`,
                            color: statusBadge.color,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedFlat(flat)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: '#1E3A8A',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Flat Inspector Modal */}
      {selectedFlat && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedFlat(null)}
        >
          <div
            style={{
              background: '#091536',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFlat(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#8FA3CB',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#1D4ED8',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                {selectedFlat.flatNumber}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
                  Residence #{selectedFlat.flatNumber}
                </h3>
                <div style={{ color: '#768EB8', fontSize: '12px' }}>
                  {getApartmentName(selectedFlat.apartmentId)} • {selectedFlat.blockId} • Floor {selectedFlat.floor}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#060E24', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ color: '#768EB8', fontSize: '11px' }}>Configuration</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px', marginTop: '2px' }}>{selectedFlat.bhk}</div>
                <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>{selectedFlat.sqft} sq.ft area</div>
              </div>

              <div style={{ background: '#060E24', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ color: '#768EB8', fontSize: '11px' }}>Monthly Rent</div>
                <div style={{ color: '#34D399', fontWeight: 700, fontSize: '13px', marginTop: '2px' }}>${selectedFlat.rent?.toLocaleString() || '2,400'}</div>
                <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>Due 1st of month</div>
              </div>
            </div>

            {selectedFlat.resident ? (
              <div style={{ background: '#060E24', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '1.25rem' }}>
                <div style={{ color: '#768EB8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
                  REGISTERED OCCUPANT PROFILE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img src={selectedFlat.resident.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>{selectedFlat.resident.name}</div>
                    <div style={{ color: '#8FA3CB', fontSize: '12px' }}>{selectedFlat.resident.email}</div>
                    <div style={{ color: '#64748B', fontSize: '11.5px', marginTop: '2px' }}>{selectedFlat.resident.phone}</div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#768EB8' }}>Lease Valid Until:</span>
                  <span style={{ color: '#60A5FA', fontWeight: 600 }}>{selectedFlat.leaseEnd || '2027-04-30'}</span>
                </div>
              </div>
            ) : (
              <div style={{ background: '#060E24', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', marginBottom: '1.25rem' }}>
                <Key size={24} color="#60A5FA" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13.5px' }}>Unit Currently Vacant</div>
                <div style={{ color: '#768EB8', fontSize: '12px', marginTop: '0.2rem' }}>Ready for tenant application or open house viewing.</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  onOpenWorkOrderModal(selectedFlat.flatNumber);
                  setSelectedFlat(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '8px',
                  background: '#1D4ED8',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Dispatch Maintenance
              </button>
              {selectedFlat.resident && (
                <button
                  onClick={() => setIsNoticeModalOpen(true)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Send Notice
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Send Electronic Notice Modal */}
      {isNoticeModalOpen && selectedFlat && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}
          onClick={() => setIsNoticeModalOpen(false)}
        >
          <div
            style={{
              background: '#091536',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 700 }}>
                Transmit Electronic Notice
              </h3>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8FA3CB', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ color: '#8FA3CB', fontSize: '13px', marginBottom: '1rem' }}>
              Recipient: <strong style={{ color: '#FFFFFF' }}>{selectedFlat.resident?.name}</strong> (Flat #{selectedFlat.flatNumber})
            </div>

            <form onSubmit={handleSendNotice}>
              <textarea
                placeholder="Enter electronic notice, community circular, or lease reminder..."
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                required
                rows={4}
                style={{
                  width: '100%',
                  background: '#060E24',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  marginBottom: '1rem'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Send size={14} /> Transmit Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidencesScreen;
