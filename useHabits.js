import { useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'streakflow_habits';
const today = () => new Date().toISOString().slice(0, 10);

function runStreakIntegrity(habits) {
  const todayStr = today();
  return habits.map(h => {
    if (h.archived) return h;
    const last = h.lastCheckedDate;
    if (!last) return { ...h, streak: 0, isCheckedToday: false };

    const diffDays = Math.round(
      (new Date(todayStr) - new Date(last)) / 86400000
    );

    if (diffDays === 0) return h; // same day – keep as-is
    if (diffDays === 1 && h.isCheckedToday) {
      // yesterday was checked – keep streak, reset today flag
      return { ...h, isCheckedToday: false };
    }
    // 2+ days ago – reset streak
    return { ...h, streak: 0, isCheckedToday: false };
  });
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return runStreakIntegrity(parsed);
  } catch {
    return [];
  }
}

function save(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export default function useHabits() {
  const [habits, setHabits] = useState(() => load());

  const mutate = useCallback((updater) => {
    setHabits(prev => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const addHabit = useCallback((data) => {
    mutate(prev => [
      ...prev,
      {
        id: uuidv4(),
        name: data.name.trim(),
        emoji: null,
        category: data.category || 'Custom',
        color: data.color || '#22c55e',
        streak: 0,
        bestStreak: 0,
        lastCheckedDate: null,
        isCheckedToday: false,
        history: [],
        createdAt: Date.now(),
        archived: false,
        note: data.note || '',
      },
    ]);
  }, [mutate]);

  const editHabit = useCallback((id, data) => {
    mutate(prev =>
      prev.map(h => h.id === id ? { ...h, ...data } : h)
    );
  }, [mutate]);

  const deleteHabit = useCallback((id) => {
    mutate(prev => prev.filter(h => h.id !== id));
  }, [mutate]);

  const archiveHabit = useCallback((id) => {
    mutate(prev =>
      prev.map(h => h.id === id ? { ...h, archived: !h.archived } : h)
    );
  }, [mutate]);

  const toggleHabit = useCallback((id) => {
    const todayStr = today();
    mutate(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        if (h.isCheckedToday) {
          // uncheck
          const newStreak = Math.max(0, h.streak - 1);
          const newHistory = h.history.filter(d => d !== todayStr);
          return {
            ...h,
            isCheckedToday: false,
            streak: newStreak,
            history: newHistory,
            lastCheckedDate: newHistory.length ? newHistory[newHistory.length - 1] : null,
          };
        } else {
          // check
          const newStreak = h.streak + 1;
          const newBest = Math.max(h.bestStreak, newStreak);
          const newHistory = h.history.includes(todayStr)
            ? h.history
            : [...h.history, todayStr];
          return {
            ...h,
            isCheckedToday: true,
            streak: newStreak,
            bestStreak: newBest,
            lastCheckedDate: todayStr,
            history: newHistory,
          };
        }
      })
    );
    // return new streak so caller can fire confetti
    const habit = habits.find(h => h.id === id);
    if (!habit) return null;
    return habit.isCheckedToday ? null : habit.streak + 1;
  }, [habits, mutate]);

  const reorderHabits = useCallback((ordered) => {
    mutate(() => ordered);
  }, [mutate]);

  const importHabits = useCallback((data) => {
    const integrity = runStreakIntegrity(data);
    mutate(() => integrity);
  }, [mutate]);

  const resetAll = useCallback(() => {
    mutate(() => []);
  }, [mutate]);

  // Summary stats
  const stats = useMemo(() => {
    const active = habits.filter(h => !h.archived);
    const done = active.filter(h => h.isCheckedToday).length;
    const bestStreak = active.reduce((m, h) => Math.max(m, h.bestStreak), 0);
    const currentStreak = active.reduce((m, h) => Math.max(m, h.streak), 0);
    const total = active.length;
    return { done, bestStreak, currentStreak, total };
  }, [habits]);

  return {
    habits,
    stats,
    addHabit,
    editHabit,
    deleteHabit,
    archiveHabit,
    toggleHabit,
    reorderHabits,
    importHabits,
    resetAll,
  };
}
