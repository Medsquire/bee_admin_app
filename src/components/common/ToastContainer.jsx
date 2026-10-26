import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--success)';
        let toastClass = 'toast-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--error)';
          toastClass = 'toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--primary-blue)';
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              className="btn btn-ghost btn-icon-sm"
              onClick={() => removeToast(toast.id)}
              style={{ padding: 0, width: '24px', height: '24px', color: 'var(--text-secondary)' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
