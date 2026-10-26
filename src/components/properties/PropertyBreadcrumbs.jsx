import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

export default function PropertyBreadcrumbs({ isOverHero = false }) {
  const {
    apartments,
    selectedApartmentId,
    selectedBlockId,
    selectedFloorId,
    clearPropertySelection,
    selectApartment,
    selectBlock
  } = useApp();

  const currentApartment = apartments.find((a) => a.id === selectedApartmentId);
  const currentBlock = currentApartment?.blocks.find((b) => b.id === selectedBlockId);
  const currentFloor = currentBlock?.floors.find((f) => f.id === selectedFloorId);

  const handleBack = () => {
    if (selectedFloorId) {
      clearPropertySelection('block');
    } else if (selectedBlockId) {
      clearPropertySelection('apartment');
    } else if (selectedApartmentId) {
      clearPropertySelection('all');
    }
  };

  if (!selectedApartmentId) return null;

  const textColor = isOverHero ? '#FFFFFF' : 'var(--dark-navy)';
  const linkColor = isOverHero ? '#BAE6FD' : 'var(--primary-blue)';
  const separatorColor = isOverHero ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-muted)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <button
        type="button"
        className={`btn ${isOverHero ? 'btn-secondary' : 'btn-secondary'} btn-sm`}
        onClick={handleBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: isOverHero ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF'
        }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.8125rem'
        }}
      >
        <span
          style={{
            color: linkColor,
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          onClick={() => clearPropertySelection('all')}
        >
          <Home size={14} />
          Apartments
        </span>

        {currentApartment && (
          <>
            <ChevronRight size={14} color={separatorColor} />
            <span
              style={{
                color: selectedBlockId ? linkColor : textColor,
                cursor: selectedBlockId ? 'pointer' : 'default',
                fontWeight: selectedBlockId ? 500 : 700
              }}
              onClick={() => {
                if (selectedBlockId) selectApartment(currentApartment.id);
              }}
            >
              {currentApartment.name}
            </span>
          </>
        )}

        {currentBlock && (
          <>
            <ChevronRight size={14} color={separatorColor} />
            <span
              style={{
                color: selectedFloorId ? linkColor : textColor,
                cursor: selectedFloorId ? 'pointer' : 'default',
                fontWeight: selectedFloorId ? 500 : 700
              }}
              onClick={() => {
                if (selectedFloorId) selectBlock(currentBlock.id);
              }}
            >
              {currentBlock.name}
            </span>
          </>
        )}

        {currentFloor && (
          <>
            <ChevronRight size={14} color={separatorColor} />
            <span style={{ color: textColor, fontWeight: 700 }}>
              {currentFloor.name}
            </span>
          </>
        )}
      </nav>
    </div>
  );
}
