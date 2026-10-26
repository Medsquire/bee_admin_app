import React from 'react';
import PropertyBreadcrumbs from './PropertyBreadcrumbs';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Building2,
  Layers,
  Home,
  CheckCircle2,
  Clock,
  Wrench,
  FileText
} from 'lucide-react';

export default function ApartmentHero({ apartment }) {
  const {
    setRwaModalApartmentId,
    setPropertyFormModal,
    setPropertyDocumentsModal,
    maintenanceRequests
  } = useApp();

  // Active maintenance requests for this apartment
  const activeMaintCount = maintenanceRequests.filter(
    (m) =>
      m.apartmentId === apartment.id &&
      (m.status === 'Reported' ||
        m.status === 'Pending Assignment' ||
        m.status === 'Assigned' ||
        m.status === 'In Progress')
  ).length;

  const occupancyRate = apartment.totalFlats > 0
    ? Math.round((apartment.occupiedFlats / apartment.totalFlats) * 100)
    : 0;

  return (
    <div
      className="apartment-hero"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backgroundImage: `url("${apartment.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--dark-navy)'
      }}
    >
      {/* Full-size dark overlay covering the entire image uniformly, including all four corners */}
      <div
        className="apartment-hero-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.65) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content positioned above the overlay */}
      <div
        className="apartment-hero-content"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '280px',
          padding: '1.5rem 2rem'
        }}
      >
        {/* Top Header: Breadcrumbs & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <PropertyBreadcrumbs isOverHero={true} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Manage Documents Button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setPropertyDocumentsModal({ isOpen: true, propertyId: apartment.id })}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
              }}
            >
              <FileText size={15} />
              Documents ({apartment.documents?.length || 0})
            </button>

            {/* Edit Property Button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                setPropertyFormModal({ isOpen: true, mode: 'edit', propertyId: apartment.id })
              }
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
              }}
            >
              <Edit2 size={15} />
              Edit Property
            </button>

            {/* Manage RWA Button */}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setRwaModalApartmentId(apartment.id)}
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-blue)',
                borderColor: '#FFFFFF',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Shield size={15} />
              Manage RWA
            </button>
          </div>
        </div>

        {/* Hero Bottom: Property Overview & Compact Inline Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <StatusBadge status={apartment.rwaStatus === 'Active' ? 'Active' : 'Not Registered'} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#BAE6FD',
                  backgroundColor: 'rgba(37, 99, 235, 0.4)',
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {apartment.status}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#E2E8F0',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                Code: {apartment.code}
              </span>
            </div>

            {/* Prominent Apartment Name */}
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '0.25rem',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)'
              }}
            >
              {apartment.name}
            </h1>

            {/* Compact Single Horizontal Information Row between Apartment Name and Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.4rem 0.75rem',
                margin: '0.4rem 0 0.55rem 0',
                fontSize: '0.8125rem',
                color: '#F1F5F9',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* 1. Total Blocks/Towers */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} color="#93C5FD" />
                <span style={{ color: '#E2E8F0' }}>Blocks:</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>
                  {apartment.totalBlocks || (apartment.blocks?.length || 0)}
                </strong>
              </span>

              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem' }}>•</span>

              {/* 2. Total Floors */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={14} color="#93C5FD" />
                <span style={{ color: '#E2E8F0' }}>Floors:</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>{apartment.totalFloors}</strong>
              </span>

              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem' }}>•</span>

              {/* 3. Total Flats */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Home size={14} color="#93C5FD" />
                <span style={{ color: '#E2E8F0' }}>Flats:</span>
                <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>{apartment.totalFlats}</strong>
              </span>

              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem' }}>•</span>

              {/* 4. Occupied Flats */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={14} color="#86EFAC" />
                <span style={{ color: '#E2E8F0' }}>Occupied:</span>
                <strong style={{ color: '#86EFAC', fontWeight: 700 }}>
                  {apartment.occupiedFlats}
                </strong>
                <span style={{ color: '#86EFAC', fontSize: '0.75rem', opacity: 0.95 }}>({occupancyRate}%)</span>
              </span>

              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem' }}>•</span>

              {/* 5. Vacant Flats */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="#FDE68A" />
                <span style={{ color: '#E2E8F0' }}>Vacant:</span>
                <strong style={{ color: '#FDE68A', fontWeight: 700 }}>{apartment.vacantFlats}</strong>
              </span>

              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.85rem' }}>•</span>

              {/* 6. Active Work Orders */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Wrench size={14} color={activeMaintCount > 0 ? '#FCA5A5' : '#86EFAC'} />
                <span style={{ color: '#E2E8F0' }}>Work Orders:</span>
                <strong style={{ color: activeMaintCount > 0 ? '#FCA5A5' : '#86EFAC', fontWeight: 700 }}>
                  {activeMaintCount}
                </strong>
              </span>
            </div>

            {/* Location immediately below the compact statistics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                color: '#CBD5E1',
                fontSize: '0.8125rem',
                flexWrap: 'wrap',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="#93C5FD" />
                {apartment.address}, {apartment.city}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="#93C5FD" />
                Built {apartment.builtYear}
              </span>
              {apartment.landArea && (
                <>
                  <span>•</span>
                  <span>Land Area: {apartment.landArea}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
