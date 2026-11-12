import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { MapPin, ArrowRight, Edit2, FileText, Building2, Home } from 'lucide-react';

export default function ApartmentCard({ apartment, onSelect }) {
  const { setPropertyFormModal, setPropertyDocumentsModal } = useApp();

  const occupancyRate = apartment.totalFlats > 0
    ? Math.round((apartment.occupiedFlats / apartment.totalFlats) * 100)
    : 0;

  return (
    <div
      className="card card-interactive"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Apartment Image with subtle gradient badge */}
      <div
        style={{ position: 'relative', height: '175px', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => onSelect(apartment.id)}
      >
        <img
          src={apartment.image}
          alt={apartment.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.35rem'
          }}
        >
          <StatusBadge status={apartment.rwaStatus === 'Active' ? 'Active' : 'Not Registered'} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {occupancyRate}% Occupied
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div onClick={() => onSelect(apartment.id)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              {apartment.name}
            </h3>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--primary-blue)',
                backgroundColor: 'var(--primary-blue-subtle)',
                border: '1px solid var(--primary-blue-border)',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {apartment.status}
            </span>
          </div>

          <div
            className="text-xs text-muted"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}
          >
            <MapPin size={13} style={{ flexShrink: 0, color: 'var(--primary-blue)' }} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {apartment.address}, {apartment.city}
            </span>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div>
          <div className="flex-between text-xs" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Occupancy</span>
            <span style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
              {apartment.occupiedFlats} / {apartment.totalFlats} Flats
            </span>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: '#E2E8F0',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${occupancyRate}%`,
                height: '100%',
                backgroundColor: occupancyRate > 90 ? 'var(--primary-blue)' : '#3B82F6',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Property Specs Grid strictly matching PRD Section 4.B:
            Total blocks/towers, total floors, total flats, occupied flats, vacant flats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.35rem',
            padding: '0.625rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginTop: 'auto'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Blocks</div>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
              {apartment.totalBlocks || (apartment.blocks?.length || 0)}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Floors</div>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
              {apartment.totalFloors}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Occupied</div>
            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>
              {apartment.occupiedFlats}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Vacant</div>
            <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {apartment.vacantFlats}
            </div>
          </div>
        </div>

        {/* Card Actions Bar strictly matching PRD Section 4.B:
            "Provide actions to: View Details, Edit Property, Manage Documents" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-light)',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setPropertyFormModal({ isOpen: true, mode: 'edit', propertyId: apartment.id });
              }}
              title="Edit Property"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Edit2 size={13} />
              Edit
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setPropertyDocumentsModal({ isOpen: true, propertyId: apartment.id });
              }}
              title="Manage Documents"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <FileText size={13} />
              Docs
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(apartment.id)}
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
