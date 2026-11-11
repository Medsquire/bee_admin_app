import React, { useState, useMemo } from 'react';
import ApartmentCard from '../components/properties/ApartmentCard';
import ApartmentHero from '../components/properties/ApartmentHero';
import BlockCard from '../components/properties/BlockCard';
import FloorCard from '../components/properties/FloorCard';
import FlatCard from '../components/properties/FlatCard';
import PropertyBreadcrumbs from '../components/properties/PropertyBreadcrumbs';
import MaintenanceList from '../components/properties/MaintenanceList';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Wrench,
  Search,
  Plus,
  FileText,
  Upload,
  Eye,
  Download
} from 'lucide-react';

export default function Properties() {
  const {
    apartments,
    selectedApartmentId,
    selectedBlockId,
    selectedFloorId,
    selectApartment,
    selectBlock,
    selectFloor,
    selectFlat,
    propertyActiveTab,
    setPropertyActiveTab,
    maintenanceRequests,
    setPropertyFormModal,
    setAddBlockModal,
    setAddFloorModal,
    setAddFlatModal,
    setPropertyDocumentsModal,
    addToast
  } = useApp();

  const [apartmentSearch, setApartmentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Identify selected entities in hierarchy
  const currentApartment = useMemo(() => {
    return apartments.find((a) => a.id === selectedApartmentId) || null;
  }, [apartments, selectedApartmentId]);

  const currentBlock = useMemo(() => {
    return currentApartment?.blocks.find((b) => b.id === selectedBlockId) || null;
  }, [currentApartment, selectedBlockId]);

  const currentFloor = useMemo(() => {
    return currentBlock?.floors.find((f) => f.id === selectedFloorId) || null;
  }, [currentBlock, selectedFloorId]);

  // Filtered apartments list
  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
      if (apartmentSearch.trim()) {
        const q = apartmentSearch.toLowerCase();
        return (
          apt.name.toLowerCase().includes(q) ||
          apt.address.toLowerCase().includes(q) ||
          apt.city.toLowerCase().includes(q) ||
          (apt.code && apt.code.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [apartments, statusFilter, apartmentSearch]);

  // LEVEL 1: ALL APARTMENTS LISTING
  if (!currentApartment) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Header Bar strictly matching PRD Section 4.A */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--dark-navy)', margin: 0 }}>
              Properties
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div className="search-wrapper" style={{ width: '260px' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search properties, city, code..."
                value={apartmentSearch}
                onChange={(e) => setApartmentSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Property Status Filter */}
            <div style={{ width: '180px' }}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Property Statuses</option>
                <option value="Active - Optimal">Active - Optimal</option>
                <option value="Active - Maintenance Due">Active - Maintenance Due</option>
                <option value="Under Expansion">Under Expansion</option>
                <option value="Under Inspection">Under Inspection</option>
              </select>
            </div>

            {/* Prominent Add Property Button strictly matching PRD Section 4.A */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setPropertyFormModal({ isOpen: true, mode: 'create', propertyId: null })}
              style={{ fontWeight: 700 }}
            >
              <Plus size={16} />
              Add Property
            </button>
          </div>
        </div>

        {/* Responsive Grid of Apartments strictly matching PRD Section 4.B */}
        {filteredApartments.length === 0 ? (
          <EmptyState
            title="No properties match your filter"
            description="Clear search or filter criteria to view all registered residential complexes."
            actionLabel="Reset Search"
            onAction={() => {
              setApartmentSearch('');
              setStatusFilter('ALL');
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onSelect={(id) => selectApartment(id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate active maintenance for this specific apartment
  const apartmentMaintenanceCount = maintenanceRequests.filter(
    (m) =>
      m.apartmentId === currentApartment.id &&
      (m.status === 'Reported' ||
        m.status === 'Pending Assignment' ||
        m.status === 'Assigned' ||
        m.status === 'In Progress')
  ).length;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SECTION A: Apartment Hero Image with Translucent Dark Overlay & Integrated Property Summary */}
      {/* Note: The 6 large StatCards beneath hero are REMOVED and integrated INSIDE the hero image overlay per PRD Section 4.C */}
      <ApartmentHero apartment={currentApartment} />

      {/* Tabs Below Hero: Blocks & Towers, Maintenance & Facilities, Property Documents */}
      <div className="tabs-nav">
        <button
          type="button"
          className={`tab-btn ${propertyActiveTab === 'blocks' ? 'active' : ''}`}
          onClick={() => setPropertyActiveTab('blocks')}
        >
          <Building2 size={16} />
          Blocks & Towers ({(currentApartment.blocks || []).length})
        </button>

        <button
          type="button"
          className={`tab-btn ${propertyActiveTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setPropertyActiveTab('maintenance')}
        >
          <Wrench size={16} />
          Maintenance & Facilities ({apartmentMaintenanceCount})
        </button>

        <button
          type="button"
          className={`tab-btn ${propertyActiveTab === 'documents' ? 'active' : ''}`}
          onClick={() => setPropertyActiveTab('documents')}
        >
          <FileText size={16} />
          Property Documents ({(currentApartment.documents || []).length})
        </button>
      </div>

      {/* TAB 1: BLOCKS & HIERARCHY EXPLORATION */}
      {propertyActiveTab === 'blocks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Breadcrumb Bar below tabs when deeper in hierarchy */}
          {(selectedBlockId || selectedFloorId) && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <PropertyBreadcrumbs isOverHero={false} />
            </div>
          )}

          {/* SUB-VIEW 1: All Blocks of this Apartment */}
          {!currentBlock && (
            <div>
              <div className="section-header" style={{ marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Residential Blocks & Towers</h2>
                </div>
                {/* Add Block Action strictly matching PRD Section 4.F */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setAddBlockModal({ isOpen: true, apartmentId: currentApartment.id })}
                >
                  <Plus size={15} />
                  Add Tower / Block
                </button>
              </div>

              {(currentApartment.blocks || []).length === 0 ? (
                <EmptyState
                  title="No blocks registered yet"
                  description="Add the first residential tower or block to this property."
                  actionLabel="+ Add Block"
                  onAction={() => setAddBlockModal({ isOpen: true, apartmentId: currentApartment.id })}
                />
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.25rem'
                  }}
                >
                  {currentApartment.blocks.map((block) => (
                    <BlockCard
                      key={block.id}
                      block={block}
                      apartmentId={currentApartment.id}
                      onSelect={(id) => selectBlock(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: Floors within Selected Block */}
          {currentBlock && !currentFloor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Block Details Header strictly matching PRD Section 4.F */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                    SELECTED TOWER
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                    {currentBlock.name}
                  </h2>
                  <p className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    {currentApartment.name} • {currentBlock.floorsCount || (currentBlock.floors?.length || 0)} Floors • {currentBlock.flatsCount} Units
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-muted">Occupancy</div>
                    <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.9375rem' }}>
                      {currentBlock.occupiedFlats} / {currentBlock.flatsCount} Flats
                    </div>
                  </div>
                  {/* Add Floor Button strictly matching PRD Section 4.G */}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      setAddFloorModal({
                        isOpen: true,
                        apartmentId: currentApartment.id,
                        blockId: currentBlock.id
                      })
                    }
                  >
                    <Plus size={15} />
                    Add Floor
                  </button>
                </div>
              </div>

              {/* Floors Grid strictly matching PRD Section 4.G */}
              <div>
                <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Floors in {currentBlock.name}</h2>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(currentBlock.floors || []).map((floor) => (
                    <FloorCard
                      key={floor.id}
                      floor={floor}
                      apartmentId={currentApartment.id}
                      blockId={currentBlock.id}
                      onSelect={(id) => selectFloor(id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: Flats within Selected Floor */}
          {currentFloor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Floor Details Header strictly matching PRD Section 4.H */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                    LEVEL DETAILS
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                    {currentFloor.name}
                  </h2>
                  <p className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                    {currentApartment.name} • {currentBlock.name}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-xs text-muted">Occupied</div>
                    <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                      {currentFloor.occupiedFlats}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-xs text-muted">Vacant</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {currentFloor.vacantFlats}
                    </div>
                  </div>

                  {/* Add Flat Button strictly matching PRD Section 4.H */}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      setAddFlatModal({
                        isOpen: true,
                        apartmentId: currentApartment.id,
                        blockId: currentBlock.id,
                        floorId: currentFloor.id
                      })
                    }
                  >
                    <Plus size={15} />
                    Add Flat
                  </button>
                </div>
              </div>

              {/* Flats Grid strictly matching PRD Section 4.H */}
              <div>
                <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Flats on {currentFloor.name}</h2>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.25rem'
                  }}
                >
                  {(currentFloor.flats || []).map((flat) => (
                    <FlatCard
                      key={flat.number}
                      flat={flat}
                      onSelect={(f) => selectFlat(currentApartment, currentBlock, currentFloor, f)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MAINTENANCE & FACILITIES */}
      {propertyActiveTab === 'maintenance' && (
        <MaintenanceList
          apartmentId={currentApartment.id}
          blockId={selectedBlockId}
        />
      )}

      {/* TAB 3: PROPERTY DOCUMENTS strictly matching PRD Section 4.D Section 5 */}
      {propertyActiveTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--dark-navy)', margin: 0 }}>
                {currentApartment.name} — Document Archive
              </h2>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setPropertyDocumentsModal({ isOpen: true, propertyId: currentApartment.id })}
            >
              <Upload size={14} />
              Manage / Upload Documents
            </button>
          </div>

          {/* Documents Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {(currentApartment.documents || []).map((doc) => (
              <div
                key={doc.id}
                className="card"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>
                      {doc.name}
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.6875rem', marginTop: '0.25rem' }}>
                      {doc.category}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>File: <strong>{doc.fileName}</strong> ({doc.fileSize || '2.5 MB'})</div>
                  <div>Upload Date: {doc.uploadDate}</div>
                  {doc.description && <div style={{ color: 'var(--text-secondary)' }}>{doc.description}</div>}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--border-light)'
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => addToast(`Opening preview for "${doc.name}"...`)}
                  >
                    <Eye size={13} />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => addToast(`Downloading "${doc.fileName}"...`)}
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
