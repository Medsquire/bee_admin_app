import React from 'react';
import { ArrowRight, Plus, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FloorCard({ floor, apartmentId, blockId, onSelect }) {
  const { setAddFlatModal } = useApp();

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: '1 1 240px' }}
        onClick={() => onSelect(floor.id)}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--light-blue)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.0625rem',
            flexShrink: 0
          }}
        >
          {floor.floorNumber}
        </div>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
            {floor.name}
          </h3>
          <div className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
            <strong>{floor.totalFlats || (floor.flats?.length || 0)}</strong> Flats • <span style={{ color: 'var(--success)' }}>{floor.occupiedFlats} Occupied</span> • {floor.vacantFlats} Vacant
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {floor.activeMaintenance > 0 ? (
          <span className="badge badge-amber">
            <span className="badge-dot" />
            {floor.activeMaintenance} Active Work Orders
          </span>
        ) : (
          <span className="badge badge-green">
            <span className="badge-dot" />
            Clear
          </span>
        )}

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            setAddFlatModal({
              isOpen: true,
              apartmentId,
              blockId,
              floorId: floor.id
            });
          }}
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
        >
          <Plus size={13} />
          Add Flat
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onSelect(floor.id)}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
        >
          <span>View Flats</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
