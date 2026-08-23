import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShopping();

  if (toasts.length === 0) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} color="#f43f5e" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={18} color="#06b6d4" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>{renderIcon(t.type)}</div>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{t.title}</div>
            <div className="toast-desc">{t.message}</div>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
