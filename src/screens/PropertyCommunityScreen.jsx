import React, { useState, useMemo } from 'react';
import {
  Building2,
  Layers,
  Grid,
  List,
  Wrench,
  Sparkles,
  Search,
  Plus,
  Home,
  Key,
  Lock,
  Unlock,
  Thermometer,
  Zap,
  ShieldCheck,
  Hexagon,
  ChevronRight,
  Phone,
  Mail,
  X,
  Check,
  MapPin,
  Star,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import {
  COMMUNITY_INFO,
  APARTMENT_TEMPLATES,
  INITIAL_COMMUNITY_FLATS
} from '../data/communityData';
import { HierarchyBuilderSubPage } from '../components/HierarchyBuilderSubPage';

export function PropertyCommunityScreen({
  apartments: propApartments,
  setApartments: propSetApartments,
  flats: propFlats,
  setFlats: propSetFlats,
  onOpenWorkOrderModal,
  addToast = () => {}
}) {
  // Live State for Apartments
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

  // Live State for Flats
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

  // Navigation / Selection State
  const [selectedApartmentId, setSelectedApartmentId] = useState(() => apartments[0]?.id || 'apt-1');
  const [selectedBlockId, setSelectedBlockId] = useState('all'); // 'all' or specific block like 'HCT-A'
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('all'); // 'all' or 1, 2, 3, 4
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Occupied' | 'Vacant' | 'Maintenance' | 'Reserved'
  const [bhkFilter, setBhkFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('elevation'); // 'elevation' | 'grid' | 'table'

  // Sub-page state: 'portfolio' (Community Portfolio & Elevation) vs 'builder' (Manual Hierarchy Builder)
  const [propertySubPage, setPropertySubPage] = useState('portfolio');

  // Modal / Drawer State
  const [inspectedFlat, setInspectedFlat] = useState(null);
  const [isAddFlatModalOpen, setIsAddFlatModalOpen] = useState(false);

  // New Flat Form State
  const [newFlatData, setNewFlatData] = useState({
    apartmentId: 'apt-1',
    blockId: 'HCT-A',
    floor: 1,
    flatNumber: '105',
    bhk: '2 BHK Deluxe',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    rent: 2500,
    facing: 'East (Garden Facing)',
    status: 'Vacant'
  });

  // Handler: Apply Manual Hierarchy from Builder
  const handleApplyHierarchy = ({ apartments: newApts, flats: newFlats, mode }) => {
    if (mode === 'replace') {
      setApartments(newApts);
      setFlats(newFlats);
      setSelectedApartmentId(newApts[0].id);
      setSelectedBlockId('all');
      try {
        localStorage.setItem('bee_apartments', JSON.stringify(newApts));
        localStorage.setItem('bee_community_flats', JSON.stringify(newFlats));
      } catch (err) {
        console.warn('Storage quota exceeded', err);
      }
    } else {
      const mergedApts = [...apartments, ...newApts];
      const mergedFlats = [...flats, ...newFlats];
      setApartments(mergedApts);
      setFlats(mergedFlats);
      setSelectedApartmentId(newApts[0].id);
      setSelectedBlockId('all');
      try {
        localStorage.setItem('bee_apartments', JSON.stringify(mergedApts));
        localStorage.setItem('bee_community_flats', JSON.stringify(mergedFlats));
      } catch (err) {
        console.warn('Storage quota exceeded', err);
      }
    }
    setPropertySubPage('portfolio');
  };

  // Active Apartment Object
  const activeApartment = useMemo(() => {
    return apartments.find(a => a.id === selectedApartmentId) || apartments[0] || APARTMENT_TEMPLATES[0];
  }, [apartments, selectedApartmentId]);

  // Available Blocks for active apartment
  const currentBlocks = activeApartment?.blocks || [];

  // Filtered flats based on user controls
  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      // Apartment filter
      if (flat.apartmentId !== selectedApartmentId) return false;

      // Block filter
      if (selectedBlockId !== 'all' && flat.blockId !== selectedBlockId) return false;

      // Floor filter
      if (selectedFloorFilter !== 'all' && flat.floor.toString() !== selectedFloorFilter.toString()) return false;

      // Status filter
      if (statusFilter !== 'all' && flat.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // BHK filter
      if (bhkFilter !== 'all' && !flat.bhk.toLowerCase().includes(bhkFilter.toLowerCase())) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = flat.flatNumber.toLowerCase().includes(query);
        const matchesBhk = flat.bhk.toLowerCase().includes(query);
        const matchesBlock = flat.blockName.toLowerCase().includes(query);
        const matchesTenant = flat.tenant?.name?.toLowerCase().includes(query);
        if (!matchesNumber && !matchesBhk && !matchesBlock && !matchesTenant) return false;
      }

      return true;
    });
  }, [flats, selectedApartmentId, selectedBlockId, selectedFloorFilter, statusFilter, bhkFilter, searchQuery]);

  // Community-wide Aggregate Statistics
  const stats = useMemo(() => {
    const totalFlats = flats.length;
    const occupied = flats.filter(f => f.status === 'Occupied').length;
    const vacant = flats.filter(f => f.status === 'Vacant').length;
    const maintenance = flats.filter(f => f.status === 'Maintenance').length;
    const reserved = flats.filter(f => f.status === 'Reserved').length;
    const occupancyRate = ((occupied / totalFlats) * 100).toFixed(1);
    const totalRentRoll = flats
      .filter(f => f.status === 'Occupied')
      .reduce((sum, f) => sum + (f.rent || 0), 0);

    return {
      totalFlats,
      occupied,
      vacant,
      maintenance,
      reserved,
      occupancyRate,
      totalRentRoll
    };
  }, [flats]);

  // Statistics for the currently selected apartment
  const aptStats = useMemo(() => {
    const aptFlats = flats.filter(f => f.apartmentId === selectedApartmentId);
    const total = aptFlats.length;
    const occupied = aptFlats.filter(f => f.status === 'Occupied').length;
    const vacant = aptFlats.filter(f => f.status === 'Vacant').length;
    const maintenance = aptFlats.filter(f => f.status === 'Maintenance').length;
    const rate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;
    return { total, occupied, vacant, maintenance, rate };
  }, [flats, selectedApartmentId]);

  // Handler: Update Flat Status
  const handleUpdateFlatStatus = (flatId, nextStatus) => {
    setFlats(prev => prev.map(f => {
      if (f.id === flatId) {
        const updated = {
          ...f,
          status: nextStatus,
          tenant: nextStatus === 'Occupied' ? (f.tenant || {
            name: 'New Assigned Resident',
            email: 'resident@beeproperty.com',
            phone: '+1 (555) 000-1122',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            leaseStart: '2026-10-01',
            leaseEnd: '2027-09-30',
            paymentStatus: 'Paid',
            occupants: f.bedrooms
          }) : null,
          statusNote: nextStatus === 'Vacant' ? 'Ready for Immediate Move-in' : nextStatus === 'Maintenance' ? 'Routine Inspection & Service' : 'Active Lease'
        };
        if (inspectedFlat && inspectedFlat.id === flatId) {
          setInspectedFlat(updated);
        }
        return updated;
      }
      return f;
    }));
    addToast('Flat Status Updated', `Flat marked as ${nextStatus}`, 'success');
  };

  // Handler: Toggle Smart Lock
  const handleToggleSmartLock = (flatId) => {
    setFlats(prev => prev.map(f => {
      if (f.id === flatId) {
        const nextLock = f.smartLockStatus === 'Locked' ? 'Unlocked' : 'Locked';
        const updated = { ...f, smartLockStatus: nextLock };
        if (inspectedFlat && inspectedFlat.id === flatId) {
          setInspectedFlat(updated);
        }
        addToast('Smart Lock Synced', `Flat ${f.flatNumber} lock is now ${nextLock.toUpperCase()}`, 'info');
        return updated;
      }
      return f;
    }));
  };

  // Handler: Add New Flat
  const handleAddNewFlat = (e) => {
    e.preventDefault();
    const apt = apartments.find(a => a.id === newFlatData.apartmentId) || activeApartment;
    const blk = apt.blocks.find(b => b.id === newFlatData.blockId) || apt.blocks[0];

    const newId = `${blk.id}-${newFlatData.flatNumber}`;
    const newFlat = {
      id: newId,
      flatNumber: newFlatData.flatNumber,
      apartmentId: apt.id,
      apartmentCode: apt.code,
      apartmentName: apt.name,
      apartmentAccent: apt.accentColor,
      blockId: blk.id,
      blockCode: blk.code,
      blockName: blk.name,
      blockWing: blk.wing,
      floor: parseInt(newFlatData.floor, 10),
      bhk: newFlatData.bhk,
      bedrooms: parseInt(newFlatData.bedrooms, 10),
      bathrooms: parseInt(newFlatData.bathrooms, 10),
      sqft: parseInt(newFlatData.sqft, 10),
      rent: parseInt(newFlatData.rent, 10),
      deposit: parseInt(newFlatData.rent, 10),
      typeTag: newFlatData.bhk.includes('Penthouse') ? 'Penthouse' : 'Deluxe',
      facing: newFlatData.facing,
      balcony: 'Private Balcony',
      status: newFlatData.status,
      statusNote: 'Newly Configured Unit',
      parkingSlot: `P-${blk.code.split('-')[1]}${newFlatData.floor}09 (EV Slot)`,
      smartLockStatus: 'Access Ready',
      temperature: 72,
      powerBackup: 'Active (100%)',
      waterMeterReading: '0 kL',
      electricityMeterReading: '0 kWh',
      features: ['Smart Keyless Digital Lock', 'Nest Smart Thermostat', 'High-speed Fiber (1 Gbps)'],
      tenant: null
    };

    setFlats(prev => [newFlat, ...prev]);
    setIsAddFlatModalOpen(false);
    addToast('Flat Created', `Unit #${newFlat.flatNumber} added to ${blk.name}`, 'success');
  };

  // Group flats by floor for the elevation view
  const floorsGrouped = useMemo(() => {
    const map = { 4: [], 3: [], 2: [], 1: [] };
    filteredFlats.forEach(f => {
      if (map[f.floor]) {
        map[f.floor].push(f);
      }
    });
    return map;
  }, [filteredFlats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

      {/* PROPERTIES SUB-NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: '#091536',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.65rem 1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setPropertySubPage('portfolio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: propertySubPage === 'portfolio' ? '#1D4ED8' : 'transparent',
              color: propertySubPage === 'portfolio' ? '#FFFFFF' : '#8FA3CB',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={16} /> Community Portfolio & Elevation
          </button>

          <button
            type="button"
            onClick={() => setPropertySubPage('builder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.5rem 1.15rem',
              borderRadius: '8px',
              border: 'none',
              background: propertySubPage === 'builder' ? 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)' : 'rgba(37, 99, 235, 0.15)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={16} /> Hierarchy Builder (Apartments ➔ Blocks ➔ Floors ➔ Flats)
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#8FA3CB' }}>
          {propertySubPage === 'builder' ? (
            <span style={{ color: '#38BDF8', fontWeight: 600 }}>Active Sub-Page: Manual Hierarchy Builder</span>
          ) : (
            <span>{apartments.length} Complexes • {flats.length} Total Flats</span>
          )}
        </div>
      </div>

      {propertySubPage === 'builder' ? (
        <HierarchyBuilderSubPage
          onApplyHierarchy={handleApplyHierarchy}
          onCancel={() => setPropertySubPage('portfolio')}
          existingApartments={apartments}
          addToast={addToast}
        />
      ) : (
        <>
          {/* 1. MASTER COMMUNITY HERO BANNER */}
          <div
        className="glass-panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Visual Background with Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to right, rgba(6, 11, 20, 0.95) 0%, rgba(11, 18, 32, 0.82) 55%, rgba(6, 11, 20, 0.92) 100%), url('${COMMUNITY_INFO.aerialImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem 2.25rem' }}>
          {/* Breadcrumb Hierarchy Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--cyan-blue)', marginBottom: '0.85rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Hexagon size={14} color="var(--cyan-blue)" /> {COMMUNITY_INFO.name}
            </span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-main)' }}>{activeApartment.name}</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-muted)' }}>
              {selectedBlockId === 'all' ? 'All 3 Blocks' : currentBlocks.find(b => b.id === selectedBlockId)?.name || 'Block View'}
            </span>
            {selectedFloorFilter !== 'all' && (
              <>
                <ChevronRight size={14} />
                <span className="badge badge-cyan">Floor {selectedFloorFilter}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--cyan-blue)'
                }}>
                  <Sparkles size={13} /> MASTER RESIDENTIAL PORTFOLIO
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {COMMUNITY_INFO.address}
                </span>
              </div>

              <h1 style={{
                fontSize: '2.4rem',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '0.6rem',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {COMMUNITY_INFO.name}
              </h1>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {COMMUNITY_INFO.description}
              </p>

              {/* Hierarchy Quick Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <Building2 size={16} color="var(--electric-blue)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>3</span>
                  <span style={{ color: 'var(--text-muted)' }}>Apartments</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <Layers size={16} color="var(--cyan-blue)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>9</span>
                  <span style={{ color: 'var(--text-muted)' }}>Blocks (3 per Apt)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <Activity size={16} color="#F59E0B" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>36</span>
                  <span style={{ color: 'var(--text-muted)' }}>Floors (4 per Blk)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <Home size={16} color="var(--success)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{stats.totalFlats}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Designer Flats</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
              <button
                onClick={() => setPropertySubPage('builder')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Layers size={18} /> Setup Hierarchy (Manual Builder)
              </button>

              <button
                onClick={() => setIsAddFlatModalOpen(true)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.75rem 1.25rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Plus size={18} /> Add Single Flat
              </button>

              <button
                onClick={() => {
                  setStatusFilter(prev => prev === 'Vacant' ? 'all' : 'Vacant');
                }}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  background: statusFilter === 'Vacant' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(15, 23, 42, 0.65)',
                  borderColor: statusFilter === 'Vacant' ? 'var(--cyan-blue)' : 'var(--border-card)',
                  color: statusFilter === 'Vacant' ? 'var(--cyan-blue)' : 'var(--text-main)'
                }}
              >
                <Sparkles size={16} color="var(--cyan-blue)" />
                {statusFilter === 'Vacant' ? 'Viewing Vacant Only' : `Show Vacant (${stats.vacant} Available)`}
              </button>

              <div style={{
                background: 'rgba(11, 18, 32, 0.85)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent Roll (Live)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--success)' }}>
                  ${(stats.totalRentRoll).toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Valuation: {COMMUNITY_INFO.valuation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COMMUNITY KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div className="card-kpi glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Community Occupancy</span>
            <span className="badge badge-online">{stats.occupancyRate}%</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
            {stats.occupied} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {stats.totalFlats} Flats</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--input-bg-theme)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${stats.occupancyRate}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '999px' }} />
          </div>
        </div>

        <div className="card-kpi glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vacant for Leasing</span>
            <span className="badge badge-vacant">Immediate</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--cyan-blue)' }}>
            {stats.vacant} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Flats</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Potential Rev: +${(stats.vacant * 2450).toLocaleString()} /mo
          </div>
        </div>

        <div className="card-kpi glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Turnover & Repairs</span>
            <span className="badge badge-warning">Active WO</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', color: '#F59E0B' }}>
            {stats.maintenance} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Flats</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Assigned to facilities crew
          </div>
        </div>

        <div className="card-kpi glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lease Reserved</span>
            <span className="badge badge-neutral" style={{ color: 'var(--indigo)' }}>Deposit In</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--indigo)' }}>
            {stats.reserved} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Flats</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Move-ins scheduled this month
          </div>
        </div>
      </div>

      {/* 3. LEVEL 1: THE 3 APARTMENTS SELECTOR (HONEYCOMB TOWERS, AMBER GROVE, NECTAR BAY) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="var(--electric-blue)" />
              1. Select Apartment Residence
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Choose one of the 3 apartment complexes to inspect its 3 blocks and multi-floor flats
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-cyan">{apartments.length} Complexes</span>
            <span className="badge badge-neutral" style={{ color: activeApartment?.accentColor || '#3B82F6', fontWeight: 700 }}>
              {activeApartment?.name}: {aptStats.occupied}/{aptStats.total} Flats ({aptStats.rate}%)
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {apartments.map((apt, idx) => {
            const isSelected = apt.id === selectedApartmentId;
            const aptFlats = flats.filter(f => f.apartmentId === apt.id);
            const occCount = aptFlats.filter(f => f.status === 'Occupied').length;
            const vacCount = aptFlats.filter(f => f.status === 'Vacant').length;
            const occPercent = aptFlats.length > 0 ? ((occCount / aptFlats.length) * 100).toFixed(0) : 0;

            return (
              <div
                key={apt.id}
                onClick={() => {
                  setSelectedApartmentId(apt.id);
                  setSelectedBlockId('all'); // reset to show all blocks in that apt
                  addToast('Apartment Selected', `Viewing ${apt.name}`, 'info');
                }}
                className="glass-panel"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? `2px solid ${apt.accentColor}` : '1px solid var(--border-card)',
                  boxShadow: isSelected ? `0 0 25px ${apt.accentColor}33` : 'var(--shadow-md)',
                  transition: 'all var(--transition-normal)',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Apartment Preview Image */}
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                  <img
                    src={apt.image}
                    alt={apt.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11, 18, 32, 0.95) 0%, rgba(11, 18, 32, 0.3) 60%, transparent 100%)'
                  }} />

                  {/* Rating Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(6, 11, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#F59E0B'
                  }}>
                    <Star size={13} fill="#F59E0B" /> {apt.rating}
                  </div>

                  {/* Apartment Code & Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: apt.accentColor,
                    color: '#060B14',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em'
                  }}>
                    APARTMENT #{idx + 1} • {apt.code}
                  </div>

                  {/* Apartment Title overlay */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
                      {apt.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--cyan-blue)', fontWeight: 500 }}>
                      {apt.tagline}
                    </div>
                  </div>
                </div>

                {/* Apartment Details Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {apt.description}
                  </p>

                  {/* 3 Blocks Pill List */}
                  <div style={{ background: 'var(--input-bg-theme)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      3 Integrated Blocks:
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {apt.blocks.map(b => (
                        <span key={b.id} style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(59, 130, 246, 0.12)',
                          color: 'var(--text-main)',
                          border: '1px solid rgba(59, 130, 246, 0.25)',
                          fontWeight: 600
                        }}>
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Occupancy & Flats Stats */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Occupancy Rate:</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{occPercent}% ({occCount}/{aptFlats.length} Flats)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--input-bg-theme)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${occPercent}%`, height: '100%', background: apt.accentColor, borderRadius: '999px' }} />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--cyan-blue)', fontWeight: 700 }}>{vacCount} Flats</span> Vacant
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isSelected ? apt.accentColor : 'var(--text-muted)'
                    }}>
                      {isSelected ? 'Currently Viewing' : 'Select Apartment'}
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Custom Apartment Hierarchy Card */}
          <div
            onClick={() => setPropertySubPage('builder')}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed rgba(59, 130, 246, 0.4)',
              background: 'rgba(37, 99, 235, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              minHeight: '280px',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              gap: '0.85rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3B82F6';
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.04)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60A5FA'
              }}
            >
              <Plus size={26} />
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '16px', fontFamily: "'Outfit', sans-serif" }}>
              Add Custom Apartment
            </div>
            <div style={{ color: '#8FA3CB', fontSize: '12px', maxWidth: '240px', lineHeight: 1.4 }}>
              Manually enter apartment name, blocks, floors, and flats in multi-step wizard.
            </div>
            <span
              style={{
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(37, 99, 235, 0.35)',
                color: '#60A5FA',
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                marginTop: '0.4rem'
              }}
            >
              Open Builder Wizard
            </span>
          </div>
        </div>
      </div>

      {/* 4. LEVEL 2: IN EACH APARTMENT, 3 BLOCKS SELECTOR */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--cyan-blue)" />
              2. Blocks in {activeApartment.name} (3 Blocks)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Select a specific block or view all 3 blocks across the building elevation
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedBlockId('all')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: `1px solid ${selectedBlockId === 'all' ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                background: selectedBlockId === 'all' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: selectedBlockId === 'all' ? 'var(--cyan-blue)' : 'var(--text-muted)'
              }}
            >
              All 3 Blocks (Panoramic)
            </button>
          </div>
        </div>

        {/* The 3 Blocks Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {currentBlocks.map((blk, idx) => {
            const isSelected = selectedBlockId === blk.id;
            const blkFlats = flats.filter(f => f.blockId === blk.id);
            const occ = blkFlats.filter(f => f.status === 'Occupied').length;
            const vac = blkFlats.filter(f => f.status === 'Vacant').length;
            const turnover = blkFlats.filter(f => f.status === 'Maintenance').length;

            return (
              <div
                key={blk.id}
                onClick={() => {
                  setSelectedBlockId(isSelected ? 'all' : blk.id);
                  addToast('Block Filter Updated', `Viewing ${blk.name}`, 'info');
                }}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--input-bg-theme)',
                  border: isSelected ? '2px solid var(--electric-blue)' : '1px solid var(--border-card)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'var(--blue-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.78rem'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{blk.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{blk.wing}</div>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Selected</span>
                  ) : (
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>16 Flats</span>
                  )}
                </div>

                {/* Block Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Floors</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>4 Floors</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Occupied</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)' }}>{occ}/16</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vacant</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--cyan-blue)' }}>{vac}</div>
                  </div>
                </div>

                {/* Infrastructure Tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Zap size={11} color="var(--warning)" /> DG Backup
                  </span>
                  •
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={11} color="var(--success)" /> {blk.security.split('+')[0]}
                  </span>
                  •
                  <span>{blk.elevators} Lifts</span>
                  {turnover > 0 && (
                    <>
                      •
                      <span style={{ color: '#F59E0B' }}>{turnover} Turnover</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search flats (e.g. 401, Penthouse, Miller)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.1rem', fontSize: '0.82rem', height: '36px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', background: 'var(--input-bg-theme)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
              <button
                onClick={() => setViewMode('elevation')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'elevation' ? 'var(--electric-blue)' : 'transparent',
                  color: viewMode === 'elevation' ? '#fff' : 'var(--text-muted)'
                }}
              >
                <Layers size={14} /> Elevation Matrix
              </button>

              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'grid' ? 'var(--electric-blue)' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)'
                }}
              >
                <Grid size={14} /> Flat Cards
              </button>

              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'table' ? 'var(--electric-blue)' : 'transparent',
                  color: viewMode === 'table' ? '#fff' : 'var(--text-muted)'
                }}
              >
                <List size={14} /> Directory Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '2px' }}>Status:</span>
            {[
              { id: 'all', label: 'All Flats' },
              { id: 'Occupied', label: 'Occupied', color: 'var(--success)' },
              { id: 'Vacant', label: 'Vacant', color: 'var(--cyan-blue)' },
              { id: 'Maintenance', label: 'Turnover', color: '#F59E0B' },
              { id: 'Reserved', label: 'Reserved', color: 'var(--indigo)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${statusFilter === tab.id ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                  background: statusFilter === tab.id ? 'rgba(59, 130, 246, 0.18)' : 'var(--input-bg-theme)',
                  color: statusFilter === tab.id ? 'var(--cyan-blue)' : 'var(--text-main)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* BHK Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type:</span>
            {[
              { id: 'all', label: 'All BHK' },
              { id: '1 BHK', label: '1 BHK' },
              { id: '2 BHK', label: '2 BHK' },
              { id: '3 BHK', label: '3 BHK' },
              { id: 'Penthouse', label: 'Penthouse' }
            ].map(bhk => (
              <button
                key={bhk.id}
                onClick={() => setBhkFilter(bhk.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${bhkFilter === bhk.id ? 'var(--cyan-blue)' : 'var(--border-card)'}`,
                  background: bhkFilter === bhk.id ? 'rgba(34, 211, 238, 0.18)' : 'var(--input-bg-theme)',
                  color: bhkFilter === bhk.id ? 'var(--cyan-blue)' : 'var(--text-muted)'
                }}
              >
                {bhk.label}
              </button>
            ))}
          </div>

          {/* Floor Quick Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>Floor:</span>
            {['all', '4', '3', '2', '1'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloorFilter(f)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${selectedFloorFilter === f ? 'var(--cyan-blue)' : 'var(--border-card)'}`,
                  background: selectedFloorFilter === f ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  color: selectedFloorFilter === f ? 'var(--cyan-blue)' : 'var(--text-muted)'
                }}
              >
                {f === 'all' ? 'All' : `F${f}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. LEVEL 3 & 4: BUILDING ELEVATION & FLATS HIERARCHY */}
      {viewMode === 'elevation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--electric-blue)" />
                3. Building Elevation Cutaway & Flats by Floor
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing {filteredFlats.length} flats across Floors 4 down to Floor 1 in {activeApartment.name}
              </div>
            </div>
          </div>

          {/* Floors Stack: From Penthouse (Floor 4) down to Floor 1 */}
          {[4, 3, 2, 1].map(floorNum => {
            const flatsOnFloor = floorsGrouped[floorNum] || [];
            if (flatsOnFloor.length === 0 && selectedFloorFilter !== 'all') return null;

            let floorTitle = `Floor ${floorNum}`;
            let floorSubtitle = 'Standard Elevation';
            let floorColor = 'var(--cyan-blue)';

            if (floorNum === 4) {
              floorTitle = 'Floor 4 — Sky Penthouse Level';
              floorSubtitle = 'Executive Penthouses • Private Wrap-around Terraces • 14ft High Ceilings';
              floorColor = '#F59E0B';
            } else if (floorNum === 3) {
              floorTitle = 'Floor 3 — Premium Vista Level';
              floorSubtitle = 'Luxury 3 BHK & 2 BHK Deluxe • Sunset Balconies • Designer Kitchens';
              floorColor = 'var(--electric-blue)';
            } else if (floorNum === 2) {
              floorTitle = 'Floor 2 — Deluxe Suites Level';
              floorSubtitle = 'Contemporary 2 BHK & Studio Suites • Courtyard & Garden Views';
              floorColor = 'var(--cyan-blue)';
            } else if (floorNum === 1) {
              floorTitle = 'Floor 1 — Ground & Terrace Lawn Level';
              floorSubtitle = 'Private Lawn Access • Stone Patios • Direct Pool Promenade Walkway';
              floorColor = 'var(--success)';
            }

            const occOnFloor = flatsOnFloor.filter(f => f.status === 'Occupied').length;
            const vacOnFloor = flatsOnFloor.filter(f => f.status === 'Vacant').length;

            return (
              <div
                key={floorNum}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid var(--border-card)`,
                  overflow: 'hidden',
                  background: 'rgba(11, 18, 32, 0.65)'
                }}
              >
                {/* Floor Header Bar */}
                <div style={{
                  padding: '0.85rem 1.5rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: floorColor,
                      color: '#060B14',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      fontFamily: 'Outfit'
                    }}>
                      FLOOR {floorNum}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{floorTitle}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{floorSubtitle}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Occupancy: <strong style={{ color: 'var(--text-main)' }}>{occOnFloor}/{flatsOnFloor.length}</strong>
                    </span>
                    {vacOnFloor > 0 && (
                      <span className="badge badge-vacant" style={{ fontSize: '0.7rem' }}>
                        {vacOnFloor} Flat Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Flats Row on this Floor */}
                <div style={{
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem'
                }}>
                  {flatsOnFloor.map(flat => {
                    let statusBadge = <span className="badge badge-online">Occupied</span>;
                    let borderTheme = 'var(--border-card)';
                    let pulseRing = false;

                    if (flat.status === 'Vacant') {
                      statusBadge = <span className="badge badge-vacant">Vacant • For Lease</span>;
                      borderTheme = 'rgba(34, 211, 238, 0.5)';
                      pulseRing = true;
                    } else if (flat.status === 'Maintenance') {
                      statusBadge = <span className="badge badge-warning">Turnover Service</span>;
                      borderTheme = 'rgba(245, 158, 11, 0.5)';
                    } else if (flat.status === 'Reserved') {
                      statusBadge = <span className="badge badge-neutral" style={{ color: 'var(--indigo)' }}>Reserved</span>;
                      borderTheme = 'rgba(99, 102, 241, 0.5)';
                    }

                    return (
                      <div
                        key={flat.id}
                        onClick={() => setInspectedFlat(flat)}
                        style={{
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-card)',
                          border: `1px solid ${borderTheme}`,
                          padding: '1rem 1.15rem',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          boxShadow: pulseRing ? '0 0 15px rgba(34, 211, 238, 0.15)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = 'var(--electric-blue)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = borderTheme;
                        }}
                      >
                        {/* Top: Flat Number, Block & Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
                              Flat #{flat.flatNumber}
                            </span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'var(--input-bg-theme)', borderRadius: '4px', color: 'var(--cyan-blue)', fontWeight: 600 }}>
                              {flat.blockCode}
                            </span>
                          </div>
                          {statusBadge}
                        </div>

                        {/* Flat BHK & Specifications */}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                            {flat.bhk}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                            <span>{flat.sqft} sq.ft</span>
                            •
                            <span>{flat.bedrooms} Bed, {flat.bathrooms} Bath</span>
                            •
                            <span>{flat.facing.split('(')[0]}</span>
                          </div>
                        </div>

                        {/* Middle: Resident or Vacant Details */}
                        {flat.status === 'Occupied' && flat.tenant ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            background: 'var(--input-bg-theme)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <img
                              src={flat.tenant.avatar}
                              alt={flat.tenant.name}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {flat.tenant.name}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                                Lease Active • {flat.tenant.paymentStatus}
                              </div>
                            </div>
                          </div>
                        ) : flat.status === 'Vacant' ? (
                          <div style={{
                            background: 'rgba(34, 211, 238, 0.08)',
                            border: '1px dashed rgba(34, 211, 238, 0.35)',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--cyan-blue)', fontWeight: 600 }}>
                              Ready for Move-In
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Dep: ${flat.deposit}
                            </span>
                          </div>
                        ) : (
                          <div style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            color: '#F59E0B'
                          }}>
                            <Wrench size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {flat.statusNote}
                          </div>
                        )}

                        {/* Bottom: Rent & Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <div>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
                              ${flat.rent.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}> /mo</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--electric-blue)', fontWeight: 600 }}>
                            Inspect Flat <ArrowUpRight size={13} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: FLAT CARDS GRID */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1rem'
        }}>
          {filteredFlats.map(flat => (
            <div
              key={flat.id}
              onClick={() => setInspectedFlat(flat)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit' }}>#{flat.flatNumber}</span>
                  <span style={{ fontSize: '0.72rem', marginLeft: '6px', color: 'var(--text-muted)' }}>Floor {flat.floor} • {flat.blockCode}</span>
                </div>
                <span className={`badge ${flat.status === 'Occupied' ? 'badge-online' : flat.status === 'Vacant' ? 'badge-vacant' : 'badge-warning'}`}>
                  {flat.status}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{flat.bhk}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {flat.sqft} sqft • {flat.facing}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>${flat.rent}/mo</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--electric-blue)', fontWeight: 600 }}>View Details</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE: DIRECTORY TABLE */}
      {viewMode === 'table' && (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
          <table className="table-custom" style={{ width: '100%', minWidth: '780px' }}>
            <thead>
              <tr>
                <th>Flat #</th>
                <th>Apartment</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Type / BHK</th>
                <th>Sqft</th>
                <th>Rent</th>
                <th>Status</th>
                <th>Tenant / Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlats.map(flat => (
                <tr key={flat.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'Outfit' }}>#{flat.flatNumber}</td>
                  <td>{flat.apartmentCode}</td>
                  <td>{flat.blockCode}</td>
                  <td>F{flat.floor}</td>
                  <td>{flat.bhk}</td>
                  <td>{flat.sqft} sqft</td>
                  <td style={{ fontWeight: 700 }}>${flat.rent}</td>
                  <td>
                    <span className={`badge ${flat.status === 'Occupied' ? 'badge-online' : flat.status === 'Vacant' ? 'badge-vacant' : 'badge-warning'}`}>
                      {flat.status}
                    </span>
                  </td>
                  <td>{flat.tenant?.name || flat.statusNote || '—'}</td>
                  <td>
                    <button
                      onClick={() => setInspectedFlat(flat)}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. SLIDE-OUT / MODAL FLAT INSPECTOR DRAWER */}
      {inspectedFlat && (
        <div
          className="drawer-overlay"
          onClick={() => setInspectedFlat(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '480px',
              maxWidth: '95vw',
              height: '100vh',
              background: 'var(--bg-sidebar)',
              borderLeft: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              gap: '1.25rem'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-card)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Flat #{inspectedFlat.flatNumber}</span>
                  <span className={`badge ${inspectedFlat.status === 'Occupied' ? 'badge-online' : inspectedFlat.status === 'Vacant' ? 'badge-vacant' : 'badge-warning'}`}>
                    {inspectedFlat.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {inspectedFlat.apartmentName} • {inspectedFlat.blockName} • Floor {inspectedFlat.floor}
                </div>
              </div>
              <button
                onClick={() => setInspectedFlat(null)}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Status Toggles */}
            <div style={{ background: 'var(--input-bg-theme)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Change Flat Status
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Occupied', 'Vacant', 'Maintenance', 'Reserved'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateFlatStatus(inspectedFlat.id, st)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${inspectedFlat.status === st ? 'var(--electric-blue)' : 'var(--border-card)'}`,
                      background: inspectedFlat.status === st ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                      color: inspectedFlat.status === st ? 'var(--cyan-blue)' : 'var(--text-muted)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Resident Info or Vacant Onboarding */}
            {inspectedFlat.status === 'Occupied' && inspectedFlat.tenant ? (
              <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Assigned Resident
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={inspectedFlat.tenant.avatar}
                    alt={inspectedFlat.tenant.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--electric-blue)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{inspectedFlat.tenant.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lease: {inspectedFlat.tenant.leaseStart} to {inspectedFlat.tenant.leaseEnd}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>{inspectedFlat.tenant.paymentStatus}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                  <a
                    href={`tel:${inspectedFlat.tenant.phone}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem', padding: '6px' }}
                  >
                    <Phone size={13} /> Call
                  </a>
                  <a
                    href={`mailto:${inspectedFlat.tenant.email}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.78rem', padding: '6px' }}
                  >
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>
            ) : inspectedFlat.status === 'Vacant' ? (
              <div className="glass-panel" style={{ padding: '1.15rem', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-blue)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Sparkles size={16} /> Vacant Unit Ready For Lease
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 12px 0' }}>
                  Flat #{inspectedFlat.flatNumber} is fully inspected and sanitized. Digital key pass is primed for self-guided resident tours.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleUpdateFlatStatus(inspectedFlat.id, 'Occupied')}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '7px' }}
                  >
                    Assign Resident
                  </button>
                  <button
                    onClick={() => addToast('Tour Link Generated', `Private access link sent for Flat #${inspectedFlat.flatNumber}`, 'success')}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '7px' }}
                  >
                    Generate Tour Pass
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '1.15rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Wrench size={16} /> Maintenance Work In Progress
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0' }}>
                  {inspectedFlat.statusNote}
                </p>
                {inspectedFlat.completionDate && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Est. Handover: {inspectedFlat.completionDate}
                  </div>
                )}
              </div>
            )}

            {/* Smart Home IoT Controls */}
            <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Smart IoT Automation
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={16} color="var(--cyan-blue)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Keyless Digital Deadbolt</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: {inspectedFlat.smartLockStatus}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSmartLock(inspectedFlat.id)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {inspectedFlat.smartLockStatus === 'Locked' ? <Lock size={12} color="var(--success)" /> : <Unlock size={12} color="var(--warning)" />}
                  {inspectedFlat.smartLockStatus === 'Locked' ? 'Unlock' : 'Lock'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Thermometer size={16} color="#F59E0B" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nest Climate Control</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target: {inspectedFlat.temperature}°F (Eco Mode)</div>
                  </div>
                </div>
                <span className="badge badge-cyan">{inspectedFlat.temperature}°F</span>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Specifications & Amenities
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Configuration:</span>
                  <div style={{ fontWeight: 600 }}>{inspectedFlat.bhk}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Carpet Area:</span>
                  <div style={{ fontWeight: 600 }}>{inspectedFlat.sqft} sq.ft</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Balcony:</span>
                  <div style={{ fontWeight: 600 }}>{inspectedFlat.balcony}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Facing:</span>
                  <div style={{ fontWeight: 600 }}>{inspectedFlat.facing}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Parking:</span>
                  <div style={{ fontWeight: 600 }}>{inspectedFlat.parkingSlot}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Monthly Rent:</span>
                  <div style={{ fontWeight: 800, color: 'var(--success)' }}>${inspectedFlat.rent} /mo</div>
                </div>
              </div>
            </div>

            {/* Dispatch Maintenance Button */}
            <button
              onClick={() => {
                if (onOpenWorkOrderModal) {
                  onOpenWorkOrderModal(inspectedFlat.flatNumber);
                }
                setInspectedFlat(null);
              }}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                fontSize: '0.85rem'
              }}
            >
              <Wrench size={16} /> Dispatch Maintenance Ticket for #{inspectedFlat.flatNumber}
            </button>
          </div>
        </div>
      )}

      {/* 8. ADD NEW FLAT MODAL */}
      {isAddFlatModalOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsAddFlatModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '520px',
              maxWidth: '100%',
              background: 'var(--bg-sidebar)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="var(--electric-blue)" />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 700 }}>
                  Add Flat to Bee Property Community
                </h3>
              </div>
              <button onClick={() => setIsAddFlatModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddNewFlat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    1. Select Apartment
                  </label>
                  <select
                    value={newFlatData.apartmentId}
                    onChange={(e) => {
                      const aptId = e.target.value;
                      const apt = APARTMENT_TEMPLATES.find(a => a.id === aptId);
                      setNewFlatData(prev => ({
                        ...prev,
                        apartmentId: aptId,
                        blockId: apt.blocks[0].id
                      }));
                    }}
                    className="form-input form-select"
                  >
                    {APARTMENT_TEMPLATES.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    2. Select Block
                  </label>
                  <select
                    value={newFlatData.blockId}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, blockId: e.target.value }))}
                    className="form-input form-select"
                  >
                    {APARTMENT_TEMPLATES.find(a => a.id === newFlatData.apartmentId)?.blocks.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    3. Select Floor
                  </label>
                  <select
                    value={newFlatData.floor}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, floor: parseInt(e.target.value, 10) }))}
                    className="form-input form-select"
                  >
                    <option value={4}>Floor 4 (Sky Penthouse)</option>
                    <option value={3}>Floor 3 (Premium Vista)</option>
                    <option value={2}>Floor 2 (Deluxe Suites)</option>
                    <option value={1}>Floor 1 (Ground / Lawn)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    4. Flat Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 105"
                    value={newFlatData.flatNumber}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, flatNumber: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    Unit BHK Type
                  </label>
                  <select
                    value={newFlatData.bhk}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, bhk: e.target.value }))}
                    className="form-input form-select"
                  >
                    <option value="1 BHK Studio Modern">1 BHK Studio Modern</option>
                    <option value="2 BHK Deluxe">2 BHK Deluxe</option>
                    <option value="3 BHK Luxury Suite">3 BHK Luxury Suite</option>
                    <option value="4 BHK Sky Penthouse">4 BHK Sky Penthouse</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    Monthly Rent ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newFlatData.rent}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, rent: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    Carpet Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    required
                    value={newFlatData.sqft}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, sqft: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    Initial Status
                  </label>
                  <select
                    value={newFlatData.status}
                    onChange={(e) => setNewFlatData(prev => ({ ...prev, status: e.target.value }))}
                    className="form-input form-select"
                  >
                    <option value="Vacant">Vacant (For Lease)</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddFlatModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={16} /> Save Flat to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </>
      )}

    </div>
  );
}

export default PropertyCommunityScreen;
