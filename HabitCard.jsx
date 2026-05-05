import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Archive, Trash2, GripVertical, Flame } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function AnimatedCheckbox({ checked, color, onClick }) {
  return (
    <motion.button
      id={`checkbox-${Math.random().toString(36).slice(2)}`}
      onClick={onClick}
      aria-label={checked ? 'Uncheck habit' : 'Check habit'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `2px solid ${checked ? color : 'var(--border)'}`,
        background: checked ? color : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        outline: 'none',
        transition: 'border-color 200ms, background-color 200ms',
      }}
      whileTap={{ scale: 0.85 }}
      animate={checked ? {
        scale: [1, 1.25, 1],
        transition: { type: 'spring', stiffness: 500, damping: 20 }
      } : { scale: 1 }}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            width="18" height="18" viewBox="0 0 18 18"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.path
              d="M3.5 9L7.5 13L14.5 5.5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function TooltipBtn({ icon: Icon, label, onClick, color }) {
  return (
    <div className="has-tooltip" style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--bg-input)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color || 'var(--text-muted)',
          transition: 'all 200ms',
        }}
      >
        <Icon size={14} />
      </button>
      <span className="tooltip">{label}</span>
    </div>
  );
}

// Animated streak number
function AnimatedNumber({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setDisplayed(value);
    setKey(k => k + 1);
  }, [value]);

  return (
    <motion.span
      key={key}
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayed}
    </motion.span>
  );
}

export default function HabitCard({ habit, onToggle, onEdit, onArchive, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={`habit-card ${habit.isCheckedToday ? 'checked' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        {/* Drag handle */}
        <div
          className="drag-handle"
          {...attributes}
          {...listeners}
          style={{ color: 'var(--text-placeholder)', cursor: 'grab', touchAction: 'none' }}
        >
          <GripVertical size={16} />
        </div>

        {/* Checkbox */}
        <AnimatedCheckbox
          checked={habit.isCheckedToday}
          color={habit.color || '#22c55e'}
          onClick={onToggle}
        />

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: habit.isCheckedToday ? '#22c55e' : 'var(--text-primary)',
            transition: 'color 300ms ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {habit.name}
          </p>
          {habit.note && (
            <p style={{
              margin: '2px 0 0',
              fontSize: 12,
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {habit.note}
            </p>
          )}
          <span style={{
            display: 'inline-block',
            marginTop: 4,
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-muted)',
            background: 'var(--bg-input)',
            borderRadius: 999,
            padding: '2px 8px',
          }}>
            {habit.category}
          </span>
        </div>

        {/* Streak badge */}
        <div className="streak-badge">
          <Flame size={12} />
          <AnimatedNumber value={habit.streak} />
        </div>
      </div>

      {/* Action row */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              borderTop: '1px solid var(--border)',
              padding: '8px 16px',
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
            }}
          >
            <TooltipBtn icon={Pencil} label="Edit" onClick={onEdit} />
            <TooltipBtn
              icon={Archive}
              label={habit.archived ? 'Unarchive' : 'Archive'}
              onClick={onArchive}
            />
            <TooltipBtn
              icon={Trash2}
              label="Delete"
              onClick={onDelete}
              color="var(--accent-red)"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
