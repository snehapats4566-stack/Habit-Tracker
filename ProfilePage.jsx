import { useMemo } from 'react';
import { Flame, Trophy, BarChart2, Calendar } from 'lucide-react';

export default function ProfilePage({ habits, stats, userProfile }) {
  const profile = userProfile.profile;
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const archivedCount = useMemo(() => habits.filter(h => h.archived).length, [habits]);

  const totalCompletions = useMemo(
    () => activeHabits.reduce((s, h) => s + h.history.length, 0),
    [activeHabits]
  );

  const longestEver = useMemo(
    () => activeHabits.reduce((m, h) => Math.max(m, h.bestStreak), 0),
    [activeHabits]
  );

  const joinDate = useMemo(() => {
    const earliest = habits.reduce((min, h) => Math.min(min, h.createdAt), Date.now());
    return new Date(earliest).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [habits]);

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Avatar card */}
      <div style={{
        background: `linear-gradient(135deg, ${profile.color}33, ${profile.color}11)`,
        border: `1px solid ${profile.color}55`,
        borderRadius: 20,
        padding: '28px 20px',
        textAlign: 'center',
        marginBottom: 24,
        transition: 'background 400ms ease, border 400ms ease',
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${profile.color}, ${profile.color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          boxShadow: `0 8px 24px ${profile.color}40`,
          overflow: 'hidden',
          padding: '8px',
        }}>
          {profile.avatar?.startsWith('pokemon-') ? (
            <img 
              src={profile.pokemonImageUrl || userProfile.getPokemonImageUrl(profile.pokemonId || 25)} 
              alt="avatar"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                display: 'block'
              }}
              onError={(e) => {
                e.target.parentElement.innerHTML = '❓';
                e.target.parentElement.style.fontSize = '40px';
              }}
            />
          ) : (
            <span style={{ fontSize: 36 }}>{userProfile.getAvatarEmoji(profile.avatar)}</span>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{profile.name}</h2>
        {profile.bio && (
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {profile.bio}
          </p>
        )}
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Streak builder since {habits.length ? joinDate : 'today'}
        </p>

      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { icon: Flame, label: 'Current Best', value: stats.currentStreak, color: '#f97316' },
          { icon: Trophy, label: 'All-Time Best', value: longestEver, color: '#eab308' },
          { icon: BarChart2, label: 'Total Done', value: totalCompletions, color: '#3b82f6' },
          { icon: Calendar, label: 'Active Habits', value: activeHabits.length, color: '#22c55e' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            boxShadow: 'var(--shadow-card)',
          }}>
            <Icon size={18} color={color} />
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Habits list */}
      <div className="section-heading">All Habits</div>
      {activeHabits.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No habits added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeHabits.map(h => (
            <div key={h.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.color || '#22c55e', flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-input)', borderRadius: 999, padding: '2px 8px' }}>{h.category}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Flame size={12} />{h.streak}
              </span>
            </div>
          ))}
          {archivedCount > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              + {archivedCount} archived
            </p>
          )}
        </div>
      )}
    </div>
  );
}
