import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShopping();

  if (toasts.length === 0) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'error':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'warning':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'info':
      default:
        return <Info size={20} color="#06B6D4" />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <div style={{ flexShrink: 0, marginTop: '1px' }}>{renderIcon(t.type)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="toast-title">{t.title}</div>
            <div className="toast-desc">{t.message}</div>
            {t.actionLabel && t.onAction && (
              <button
                className="toast-action-btn"
                onClick={() => {
                  t.onAction?.();
                  removeToast(t.id);
                }}
                style={{ marginTop: '0.4rem' }}
              >
                {t.actionLabel}
              </button>
            )}
          </div>
          <button
            className="toast-dismiss-btn"
            onClick={() => removeToast(t.id)}
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

