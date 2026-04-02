import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

const NotificationContext = createContext(null);

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'border-[rgba(120,211,143,0.24)] bg-[linear-gradient(180deg,rgba(14,24,16,0.96),rgba(8,16,10,0.95))] text-[#e8f7eb]',
  error: 'border-[rgba(255,103,103,0.22)] bg-[linear-gradient(180deg,rgba(28,14,14,0.96),rgba(18,9,9,0.95))] text-[#fdeaea]',
  info: 'border-[rgba(214,177,111,0.22)] bg-[linear-gradient(180deg,rgba(26,22,16,0.96),rgba(14,11,8,0.95))] text-[#f4ebdc]',
  warning: 'border-[rgba(235,189,95,0.24)] bg-[linear-gradient(180deg,rgba(32,24,10,0.96),rgba(18,13,6,0.95))] text-[#f9efdb]',
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const toastIdRef = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = ++toastIdRef.current;
    const duration = options.duration ?? 3400;
    const tone = options.tone ?? 'info';

    setToasts((current) => [...current, { id, message, tone, title: options.title ?? null }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((options) => new Promise((resolve) => {
    setConfirmState({
      title: options.title ?? 'Please confirm',
      message: options.message ?? 'Are you sure you want to continue?',
      tone: options.tone ?? 'warning',
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      resolve,
    });
  }), []);

  const closeConfirm = useCallback((result) => {
    setConfirmState((current) => {
      if (!current) return null;
      current.resolve(result);
      return null;
    });
  }, []);

  const value = useMemo(() => ({ showToast, confirm }), [showToast, confirm]);

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[140] flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-3">
          <AnimatePresence>
            {toasts.map((toast) => {
              const Icon = toastIcons[toast.tone] ?? Info;
              return (
                <Motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className={`pointer-events-auto rounded-[1.6rem] border shadow-[0_22px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl ${toastStyles[toast.tone] ?? toastStyles.info}`}
                >
                  <div className="flex items-start gap-3 px-4 py-4">
                    <div className="mt-0.5 rounded-full border border-white/10 bg-white/5 p-2">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {toast.title ? <div className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-accent">{toast.title}</div> : null}
                      <p className={`text-sm leading-6 ${toast.title ? 'mt-1' : ''}`}>{toast.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissToast(toast.id)}
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {confirmState ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/68 px-4 backdrop-blur-sm"
          >
            <Motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg rounded-[2rem] border border-[rgba(214,177,111,0.18)] bg-[linear-gradient(180deg,rgba(22,18,15,0.98),rgba(12,10,8,0.98))] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full border border-[rgba(214,177,111,0.18)] bg-accent/10 p-3 text-accent">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-accent">
                    {confirmState.tone === 'danger' ? 'Please Confirm' : 'Quick Check'}
                  </div>
                  <h3 className="mt-3 font-heading text-3xl leading-none text-white">{confirmState.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#dccfb8]">{confirmState.message}</p>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => closeConfirm(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/85 transition-colors hover:bg-white/8"
                >
                  {confirmState.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => closeConfirm(true)}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#e2c88e]"
                >
                  {confirmState.confirmLabel}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
