import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, type LucideIcon } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
}

const config: Record<AlertType, { bg: string; border: string; text: string; Icon: LucideIcon }> = {
  success: { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800', Icon: CheckCircle2 },
  error:   { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-800',   Icon: AlertCircle  },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-800',  Icon: Info         },
  warning: { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-800', Icon: AlertCircle  },
};

export const Alert: React.FC<AlertProps> = ({ type, message, onDismiss }) => {
  const [visible, setVisible] = useState(true);
  const { bg, border, text, Icon } = config[type];

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDismiss?.(); }, 4500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${bg} ${border} ${text}`}
      role="alert"
      style={{ animation: 'modalIn 0.2s ease-out' }}
    >
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        className="shrink-0 hover:opacity-60 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ── Hook de conveniência ───────────────────────────────────────────────────────
export const useAlert = () => {
  const [alertState, setAlertState] = useState<{ type: AlertType; message: string } | null>(null);

  const showAlert = (type: AlertType, message: string) => setAlertState({ type, message });
  const clearAlert = () => setAlertState(null);

  const AlertBanner = alertState
    ? <Alert key={alertState.message + Date.now()} type={alertState.type} message={alertState.message} onDismiss={clearAlert} />
    : null;

  return { showAlert, AlertBanner };
};
