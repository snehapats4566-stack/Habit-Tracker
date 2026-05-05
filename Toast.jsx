import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, icon = 'trophy') => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #0d9488)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
              pointerEvents: 'all',
              maxWidth: 360,
            }}
          >
            <Trophy size={18} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
