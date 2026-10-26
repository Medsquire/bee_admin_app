import React from 'react';
import { ArrowRight, ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BlockCard({ block, apartmentId, onSelect }) {
  const { setEditBlockModal, deleteBlock } = useApp();

  const flatsTotal = block.flatsCount || (block.occupiedFlats + block.vacantFlats) || 0;
  const occupancyRate = flatsTotal > 0
    ? Math.round((block.occupiedFlats / flatsTotal) * 100)
    : 0;

  return (
    <div
      className="card card-interactive"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Header */}
        <div className="flex-between">
          <div onClick={() => onSelect(block.id)} style={{ cursor: 'pointer' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--primary-blue)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {block.code || 'Tower'}
            </span>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--dark-navy)' }}>
              {block.name}
            </h3>
          </div>
          <span className="badge badge-green">
            <span className="badge-dot" />
            {block.status || 'Operational'}
          </span>
        </div>

        {/* Occupancy Indicator */}
        <div onClick={() => onSelect(block.id)} style={{ cursor: 'pointer' }}>
          <div className="flex-between text-xs" style={{ marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Occupancy</span>
            <span style={{ fontWeight: 700, color: 'var(--dark-navy)' }}>
              {block.occupiedFlats} of {flatsTotal} Flats ({occupancyRate}%)
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
                backgroundColor: 'var(--primary-blue)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
        </div>

        {/* Metric Badges strictly matching PRD Section 4.F:
            Total floors, total flats, occupied flats, vacant flats, active maintenance requests */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.35rem',
            padding: '0.625rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Floors</div>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
              {block.floorsCount || (block.floors?.length || 0)}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Flats</div>
            <div style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '0.875rem' }}>
              {flatsTotal}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Occupied</div>
            <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>
              {block.occupiedFlats}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <div className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Vacant</div>
            <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {block.vacantFlats}
            </div>
          </div>
        </div>

        {/* Active Maintenance Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span className="text-muted">Active Work Orders:</span>
          <span style={{ fontWeight: 700, color: (block.activeMaintenance || 0) > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {block.activeMaintenance || 0} issues
          </span>
        </div>

        {/* Action Link & Edit Trigger strictly matching PRD Section 4.F */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-light)',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setEditBlockModal({ isOpen: true, apartmentId, block });
              }}
              title="Edit Tower"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Edit2 size={13} />
              Edit
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${block.name}? This will remove all associated floors and flats.`)) {
                  deleteBlock(apartmentId, block.id);
                }
              }}
              title="Delete Tower"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Trash2 size={13} color="var(--error)" />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(block.id)}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            <span>View Floors</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
