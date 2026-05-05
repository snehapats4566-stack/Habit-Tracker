import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Search, Plus, BookOpen } from 'lucide-react';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';
import confetti from 'canvas-confetti';

const MILESTONE_STREAKS = [7, 30, 100];

function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" stroke="var(--border)" strokeWidth="2" strokeDasharray="8 4" />
        <rect x="35" y="42" width="50" height="8" rx="4" fill="var(--border)" />
        <rect x="35" y="56" width="38" height="8" rx="4" fill="var(--border)" />
        <rect x="35" y="70" width="44" height="8" rx="4" fill="var(--border)" />
        <circle cx="27" cy="46" r="5" fill="var(--border)" />
        <circle cx="27" cy="60" r="5" fill="var(--border)" />
        <circle cx="27" cy="74" r="5" fill="var(--border)" />
      </svg>
      <div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          No habits yet
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Start building your streak by adding your first habit
        </p>
      </div>
      <button className="btn-primary" onClick={onAdd} id="empty-add-btn">
        Add Your First Habit
      </button>
    </div>
  );
}

function FilterBar({ filter, setFilter, sort, setSort, search, setSearch }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-input)',
        borderRadius: 999,
        padding: 3,
        marginBottom: 12,
        width: 'fit-content',
      }}>
        {['All', 'Active', 'Archived'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            id={`filter-${f.toLowerCase()}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search */}
        <div className="search-wrap" style={{ flex: 1 }}>
          <Search size={15} className="search-icon" />
          <input
            id="habit-search"
            className="sf-input"
            placeholder="Search habits..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <select
          id="habit-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="sf-input"
          style={{ width: 'auto', minWidth: 130 }}
        >
          <option value="default">Default</option>
          <option value="az">A – Z</option>
          <option value="streak-high">Streak High–Low</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
    </div>
  );
}

export default function TodayPage({ habits, addHabit, editHabit, deleteHabit, archiveHabit, toggleHabit, reorderHabits, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [filter, setFilter] = useState('Active');
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleToggle = useCallback((id) => {
    // get pre-toggle state
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    const wasChecked = habit.isCheckedToday;
    toggleHabit(id);
    if (!wasChecked) {
      const newStreak = habit.streak + 1;
      if (MILESTONE_STREAKS.includes(newStreak)) {
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#0d9488', '#f97316', '#eab308'],
        });
        addToast(`${newStreak}-Day Streak Unlocked!`);
      }
    }
  }, [habits, toggleHabit, addToast]);

  const filtered = useMemo(() => {
    let list = habits;
    if (filter === 'Active') list = list.filter(h => !h.archived);
    else if (filter === 'Archived') list = list.filter(h => h.archived);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q));
    }

    if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'streak-high') list = [...list].sort((a, b) => b.streak - a.streak);
    else if (sort === 'recent') list = [...list].sort((a, b) => b.createdAt - a.createdAt);

    return list;
  }, [habits, filter, sort, search]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = habits.findIndex(h => h.id === active.id);
    const newIndex = habits.findIndex(h => h.id === over.id);
    reorderHabits(arrayMove(habits, oldIndex, newIndex));
  }, [habits, reorderHabits]);

  const handleSaveHabit = useCallback((data) => {
    if (editingHabit) {
      editHabit(editingHabit.id, data);
      setEditingHabit(null);
    } else {
      addHabit(data);
    }
  }, [editingHabit, editHabit, addHabit]);

  return (
    <div style={{ paddingBottom: 100 }}>
      <FilterBar
        filter={filter} setFilter={setFilter}
        sort={sort} setSort={setSort}
        search={search} setSearch={setSearch}
      />

      {filtered.length === 0 ? (
        filter === 'Archived' ? (
          <div className="empty-state">
            <BookOpen size={48} color="var(--border)" />
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No archived habits</p>
          </div>
        ) : (
          <EmptyState onAdd={() => setShowModal(true)} />
        )
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filtered.map(h => h.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {filtered.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() => handleToggle(habit.id)}
                    onEdit={() => { setEditingHabit(habit); setShowModal(true); }}
                    onArchive={() => archiveHabit(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* FAB */}
      <motion.button
        id="add-habit-fab"
        className="fab"
        onClick={() => { setEditingHabit(null); setShowModal(true); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Add habit"
      >
        <Plus size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddHabitModal
            onClose={() => { setShowModal(false); setEditingHabit(null); }}
            onSave={handleSaveHabit}
            initialData={editingHabit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
