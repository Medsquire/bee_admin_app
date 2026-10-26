import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Search,
  title = 'No records found',
  description = 'Try adjusting your search query or filter options.',
  actionLabel,
  onAction
}) {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color)',
        margin: '1rem 0'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--light-blue)',
          color: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={24} />
      </div>
      <h3 style={{ marginBottom: '0.35rem', color: 'var(--dark-navy)' }}>{title}</h3>
      <p className="text-muted" style={{ maxWidth: '380px', marginBottom: actionLabel ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
