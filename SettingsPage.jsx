import { useState, useRef } from 'react';
import { Download, Upload, Trash2, Bell, Monitor, Sun, Moon, Info, Edit3, Palette } from 'lucide-react';
import AvatarModal from './AvatarModal';

const APP_VERSION = '1.0.0';

export default function SettingsPage({ habits, importHabits, resetAll, theme, setTheme, userProfile }) {
  const [notifTime, setNotifTime] = useState('08:00');
  const [resetStep, setResetStep] = useState(0);
  const [importPreview, setImportPreview] = useState(null);
  const [userName, setUserName] = useState(userProfile.profile.name);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileRef = useRef();

  const exportData = () => {
    const blob = new Blob([JSON.stringify(habits, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streakflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) return alert('Invalid backup file.');
        setImportPreview(data);
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    importHabits(importPreview);
    setImportPreview(null);
  };

  const requestNotification = async () => {
    if (!('Notification' in window)) return alert('Notifications not supported in this browser.');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      alert(`Daily reminder set for ${notifTime}`);
    }
  };

  const handleReset = () => {
    if (resetStep === 0) { setResetStep(1); return; }
    resetAll();
    setResetStep(0);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Profile Section */}
      <section style={{ marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            title="Click to change avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${userProfile.profile.color}, ${userProfile.profile.color}cc)`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = `0 8px 20px ${userProfile.profile.color}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {userProfile.profile.avatar?.startsWith('pokemon-') ? (
              <img 
                src={userProfile.profile.pokemonImageUrl || userProfile.getPokemonImageUrl(userProfile.profile.pokemonId || 25)} 
                alt="avatar"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  display: 'block',
                  padding: '8px'
                }}
                onError={(e) => {
                  e.target.parentElement.innerHTML = '❓';
                  e.target.parentElement.style.fontSize = '32px';
                }}
              />
            ) : (
              <span style={{ fontSize: 32 }}>{userProfile.getAvatarEmoji(userProfile.profile.avatar)}</span>
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: 'var(--accent)',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card)',
            }}>
              <Edit3 size={12} color="white" />
            </div>
          </button>

          {/* Name & Bio */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Display Name
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="sf-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value.slice(0, 24))}
                  placeholder="Your name"
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn-primary" 
                  onClick={() => userProfile.updateName(userName)}
                  style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: 13 }}
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Bio (Optional)
              </label>
              <textarea
                className="sf-input"
                value={userProfile.profile.bio}
                onChange={(e) => userProfile.updateBio(e.target.value)}
                placeholder="Tell us about yourself..."
                style={{ 
                  width: '100%',
                  minHeight: 60,
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: 13,
                }}
              />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                {userProfile.profile.bio.length}/100
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Color */}
      <section style={{ marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Palette size={16} color="var(--accent)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Profile Background Color</span>
          <span style={{
            marginLeft: 'auto',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: userProfile.profile.color,
            boxShadow: `0 2px 6px ${userProfile.profile.color}60`,
            display: 'inline-block',
            flexShrink: 0,
          }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { hex: '#22c55e', label: 'Green' },
            { hex: '#3b82f6', label: 'Blue' },
            { hex: '#a855f7', label: 'Purple' },
            { hex: '#f97316', label: 'Orange' },
            { hex: '#ec4899', label: 'Pink' },
            { hex: '#14b8a6', label: 'Teal' },
            { hex: '#eab308', label: 'Yellow' },
            { hex: '#ef4444', label: 'Red' },
            { hex: '#06b6d4', label: 'Cyan' },
            { hex: '#8b5cf6', label: 'Violet' },
            { hex: '#f43f5e', label: 'Rose' },
            { hex: '#10b981', label: 'Emerald' },
          ].map(({ hex, label }) => (
            <button
              key={hex}
              onClick={() => userProfile.updateColor(hex)}
              title={label}
              aria-label={`Set profile color to ${label}`}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: hex,
                border: userProfile.profile.color === hex ? '3px solid white' : '3px solid transparent',
                outline: userProfile.profile.color === hex ? `2px solid ${hex}` : 'none',
                cursor: 'pointer',
                boxShadow: `0 2px 8px ${hex}60`,
                transition: 'transform 150ms ease, outline 150ms ease',
                transform: userProfile.profile.color === hex ? 'scale(1.25)' : 'scale(1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* Theme */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-heading">Theme</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { id: 'light', label: 'Light', Icon: Sun },
            { id: 'dark', label: 'Dark', Icon: Moon },
            { id: 'system', label: 'System', Icon: Monitor },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              id={`theme-${id}`}
              className={`theme-tile ${theme === id ? 'active' : ''}`}
              onClick={() => setTheme(id)}
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              <Icon size={20} color={theme === id ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Notification */}
      <section style={{ marginBottom: 28 }}>
        <div className="section-heading">Daily Reminder</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            id="notif-time"
            type="time"
            className="sf-input"
            value={notifTime}
            onChange={e => setNotifTime(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={requestNotification} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', padding: '10px 18px' }}>
            <Bell size={15} /> Set Reminder
          </button>
        </div>
      </section>

      {/* Avatar Modal */}
      <AvatarModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} userProfile={userProfile} />
    </div>
  );
}
