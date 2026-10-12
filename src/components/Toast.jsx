import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let icon = <Info size={18} color="var(--cyan-blue)" />;
        let borderColor = 'var(--cyan-blue)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="var(--success)" />;
          borderColor = 'var(--success)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} color="var(--warning)" />;
          borderColor = 'var(--warning)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="var(--error)" />;
          borderColor = 'var(--error)';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              minWidth: '320px',
              maxWidth: '440px',
              background: 'var(--bg-sidebar)',
              color: 'var(--text-main)',
              border: `1px solid ${borderColor}`,
              boxShadow: 'var(--shadow-lg), 0 0 20px rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div>{icon}</div>
            <div style={{ flex: 1, fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 600 }}>{toast.title}</div>
              {toast.message && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</div>}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
