import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, COLORS } from './constants';

export default function AddHabitModal({ onClose, onSave, initialData = null }) {
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Health');
  const [color, setColor] = useState(initialData?.color || '#22c55e');
  const [note, setNote] = useState(initialData?.note || '');

  const nameLen = name.trim().length;
  const canSave = nameLen > 0 && nameLen <= 50;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), category, color, note: note.trim() });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="bottom-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      >
        {/* Handle bar */}
        <div style={{
          width: 40, height: 4,
          background: 'var(--border)',
          borderRadius: 999,
          margin: '-8px auto 20px',
        }} />

        <h2 style={{
          margin: '0 0 20px',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          {isEdit ? 'Edit Habit' : 'New Habit'}
        </h2>

        {/* Name */}
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
          Habit Name
        </label>
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <input
            id="habit-name-input"
            className="sf-input"
            placeholder="e.g. Morning run, Read 10 pages..."
            value={name}
            maxLength={50}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{
          textAlign: 'right',
          fontSize: 11,
          color: nameLen > 45 ? 'var(--accent-red)' : 'var(--text-muted)',
          marginBottom: 20,
        }}>
          {nameLen}/50
        </div>

        {/* Color picker */}

        {/* Category */}
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>
          Category
        </label>
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: 24,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`category-pill ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Note */}
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
          Note <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          className="sf-input"
          placeholder="Why this habit matters to you..."
          value={note}
          maxLength={120}
          onChange={e => setNote(e.target.value)}
          rows={2}
          style={{ resize: 'none', marginBottom: 28 }}
        />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            id="save-habit-btn"
            className="btn-primary"
            onClick={handleSave}
            disabled={!canSave}
            style={{ flex: 2, opacity: canSave ? 1 : 0.5 }}
          >
            {isEdit ? 'Save Changes' : 'Add Habit'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
