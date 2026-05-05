import { useState, lazy, Suspense, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Settings, User } from 'lucide-react';

import useHabits from './useHabits';
import useUserProfile from './useUserProfile';
import useTheme from './useTheme';
import { useToast, ToastContainer } from './Toast';

import Header from './Header';
import HeroCard from './HeroCard';
import TodayPage from './TodayPage';

const StatsPage = lazy(() => import('./StatsPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));

const NAV_TABS = [
  { id: 'today', label: 'Today', Icon: Home },
  { id: 'stats', label: 'Stats', Icon: BarChart2 },
  { id: 'settings', label: 'Settings', Icon: Settings },
  { id: 'profile', label: 'Profile', Icon: User },
];

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 200, color: 'var(--text-muted)', fontSize: 14,
    }}>
      <div style={{
        width: 28, height: 28, border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

function BottomNav({ active, setActive }) {
  const activeIndex = NAV_TABS.findIndex(t => t.id === active);

  return (
    <nav
      className="tab-bar"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        zIndex: 300,
        padding: '0 8px',
      }}
      aria-label="Main navigation"
    >
      {NAV_TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`nav-${id}`}
            onClick={() => setActive(id)}
            aria-label={label}
            style={{
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: 0,
              minWidth: 44,
              minHeight: 44,
            }}
          >
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            >
              <Icon
                size={22}
                color={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </motion.div>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 200ms',
            }}>
              {label}
            </span>
            {isActive && (
              <motion.div
                layoutId="nav-dot"
                style={{
                  position: 'absolute',
                  bottom: 6,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('today');
  const { theme, setTheme, toggleDarkLight } = useTheme();
  const { toasts, addToast, removeToast } = useToast();
  const userProfile = useUserProfile();
  const {
    habits, stats,
    addHabit, editHabit, deleteHabit, archiveHabit, toggleHabit,
    reorderHabits, importHabits, resetAll,
  } = useHabits();

  return (
    <>
      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Fullscreen video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.18,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
        <Header toggleDarkLight={toggleDarkLight} userProfile={userProfile} />

        {/* Hero card only on Today page */}
        <AnimatePresence mode="wait">
          {activePage === 'today' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HeroCard stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page heading */}
        {activePage !== 'today' && (
          <div style={{ margin: '20px 0 16px' }}>
            <h1 style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              {NAV_TABS.find(t => t.id === activePage)?.label}
            </h1>
          </div>
        )}

        {/* Pages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Suspense fallback={<PageLoader />}>
              {activePage === 'today' && (
                <TodayPage
                  habits={habits}
                  addHabit={addHabit}
                  editHabit={editHabit}
                  deleteHabit={deleteHabit}
                  archiveHabit={archiveHabit}
                  toggleHabit={toggleHabit}
                  reorderHabits={reorderHabits}
                  addToast={addToast}
                />
              )}
              {activePage === 'stats' && <StatsPage habits={habits} />}
              {activePage === 'settings' && (
                <SettingsPage
                  habits={habits}
                  importHabits={importHabits}
                  resetAll={resetAll}
                  theme={theme}
                  setTheme={setTheme}
                  userProfile={userProfile}
                />
              )}
              {activePage === 'profile' && <ProfilePage habits={habits} stats={stats} userProfile={userProfile} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav active={activePage} setActive={setActivePage} />
    </>
  );
}
