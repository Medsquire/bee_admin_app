import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { User, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FlatCard({ flat, onSelect }) {
  const isOccupied = flat.status === 'Occupied';

  return (
    <div
      className="card card-interactive"
      onClick={() => onSelect(flat)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        gap: '0.75rem',
        borderLeft: isOccupied ? '4px solid var(--primary-blue)' : '4px solid #CBD5E1'
      }}
    >
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--dark-navy)',
              letterSpacing: '-0.02em'
            }}
          >
            Flat {flat.number}
          </div>
          {flat.residentType && (
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: flat.residentType === 'Owner' ? 'var(--light-blue)' : '#F1F5F9',
                color: flat.residentType === 'Owner' ? 'var(--primary-blue)' : 'var(--text-secondary)'
              }}
            >
              {flat.residentType}
            </span>
          )}
        </div>
        <StatusBadge status={flat.status} />
      </div>

      {isOccupied ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: 'var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <User size={14} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--dark-navy)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {flat.residentName}
            </div>
            <div className="text-xs text-muted">Primary Resident</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}
        >
          Vacant — Ready for Lease or Allotment
        </div>
      )}

      {/* Ticket warning if any */}
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
        {flat.activeMaintenance > 0 ? (
          <span
            className="text-xs font-semibold"
            style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <AlertTriangle size={13} />
            {flat.activeMaintenance} Active Work Order
          </span>
        ) : (
          <span
            className="text-xs text-muted"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <CheckCircle2 size={13} color="var(--success)" />
            No open tickets
          </span>
        )}
        <span className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
          Manage →
        </span>
      </div>
    </div>
  );
}
