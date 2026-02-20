import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const notify = useCallback(
    {
      success: (msg, duration) => addToast("success", msg, duration),
      error: (msg, duration) => addToast("error", msg, duration),
      info: (msg, duration) => addToast("info", msg, duration),
    },
    [addToast]
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-none px-2 sm:px-0"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ id, type, message, onClose }) {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-white border-green-200 shadow-lg shadow-green-500/10",
      iconBg: "bg-green-500",
      iconColor: "text-white",
    },
    error: {
      icon: XCircle,
      bg: "bg-white border-red-200 shadow-lg shadow-red-500/10",
      iconBg: "bg-red-500",
      iconColor: "text-white",
    },
    info: {
      icon: AlertCircle,
      bg: "bg-white border-primary/30 shadow-lg shadow-primary/10",
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
  };

  const { icon: Icon, bg, iconBg, iconColor } = config[type] ?? config.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${bg} toast-enter`}
    >
      <div className={`flex-shrink-0 p-1.5 rounded-lg ${iconBg} ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="flex-1 text-sm font-medium text-gray-800 break-words">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
