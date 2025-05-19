import { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
}

const ToastContext = createContext<(msg: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string) => {
    setToasts((t) => [...t, { id: Date.now(), message }]);
    setTimeout(() => setToasts((t) => t.slice(1)), 3000);
  };
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: 'fixed', top: 10, right: 10 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: '4px',
              background: '#333',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
