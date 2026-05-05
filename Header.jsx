import { useState, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Header({ toggleDarkLight, userProfile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userProfile.profile.name);
  const inputRef = useRef(null);
  const isDark = document.documentElement.classList.contains('dark');

  const startEdit = () => {
    setDraft(userProfile.profile.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const commitEdit = () => {
    userProfile.updateName(draft);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  return (
    <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 200, padding: '12px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Top row: logo + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand (logo + title) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.jpg" alt="Momentum logo" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }} />

            {/* Creative wordmark */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>

              {/* Floating sparkle dots above text */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -8, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', pointerEvents: 'none' }}>
                  {['#22c55e','#0d9488','#34d399','#14b8a6','#4ade80','#0f766e'].map((color, i) => (
                    <span
                      key={i}
                      className="sparkle-dot"
                      style={{
                        width: i % 2 === 0 ? 4 : 3,
                        height: i % 2 === 0 ? 4 : 3,
                        background: color,
                        boxShadow: `0 0 6px ${color}`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                {/* App name */}
                <span className="momentum-title">Momentum</span>
              </div>

            </div>

          </div>

          {/* Theme toggle */}
          <button
            id="theme-toggle"
            onClick={toggleDarkLight}
            aria-label="Toggle theme"
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'var(--bg-input)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'all 200ms',
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Greeting row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
            {greeting()},
          </span>
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value.slice(0, 24))}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              style={{
                fontSize: 14, fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1.5px solid var(--accent)',
                outline: 'none',
                padding: '0 2px',
                width: Math.max(60, draft.length * 9),
                fontFamily: 'inherit',
              }}
              autoFocus
            />
          ) : (
            <button
              id="username-btn"
              onClick={startEdit}
              title="Click to edit your name"
              style={{
                fontSize: 14, fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                borderBottom: '1px dashed var(--border)',
                lineHeight: 1.4,
              }}
            >
              {userProfile.profile.name}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
