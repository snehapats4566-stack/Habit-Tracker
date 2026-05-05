import { useMemo } from 'react';
import { Trophy, Flame, BarChart2 } from 'lucide-react';
import { getLast90Days } from './constants';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Heatmap tooltip state
import { useState } from 'react';


// Individual habit performance chart
// Completion rate pie chart
function CompletionRatePie({ habits }) {
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  const stats = useMemo(() => {
    const totalCompletions = activeHabits.reduce((s, h) => s + h.history.length, 0);
    const totalPossible = activeHabits.reduce((s, h) => {
      const created = new Date(h.createdAt);
      const today = new Date();
      const days = Math.max(1, Math.ceil((today - created) / 86400000));
      return s + days;
    }, 0);
    const completed = totalCompletions;
    const missed = Math.max(0, totalPossible - totalCompletions);
    return [
      { name: 'Completed', value: completed, fill: '#22c55e' },
      { name: 'Missed', value: missed, fill: 'var(--bg-input)' }
    ];
  }, [activeHabits]);

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
        Completion Overview
      </h3>
      {stats[0].value + stats[1].value === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


function HeatmapCell({ day, count, total }) {
  const [hover, setHover] = useState(false);
  const pct = total === 0 ? 0 : count / total;
  const alpha = pct === 0 ? 0 : Math.max(0.15, pct);
  const bg = pct === 0
    ? 'var(--bg-input)'
    : `rgba(34, 197, 94, ${alpha})`;

  const label = new Date(day + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="heatmap-cell"
        style={{ background: bg }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {hover && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--text-primary)',
          color: 'var(--bg-card)',
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 50,
        }}>
          {label}: {count}/{total}
        </div>
      )}
    </div>
  );
}

function Heatmap({ habits }) {
  const days = getLast90Days();
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const total = activeHabits.length;

  const completionMap = useMemo(() => {
    const map = {};
    days.forEach(day => {
      const count = activeHabits.filter(h => h.history.includes(day)).length;
      map[day] = count;
    });
    return map;
  }, [days, activeHabits]);

  // Split into weeks
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < days.length; i += 7) {
      w.push(days.slice(i, i + 7));
    }
    return w;
  }, [days]);

  return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <div key={v} className="heatmap-cell" style={{
            background: v === 0 ? 'var(--bg-input)' : `rgba(34,197,94,${v})`,
          }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
      </div>
  );
}

function Leaderboard({ habits }) {
  const activeHabits = useMemo(() =>
    habits.filter(h => !h.archived).sort((a, b) => b.streak - a.streak).slice(0, 3),
    [habits]
  );

  const rankStyles = ['rank-gold', 'rank-silver', 'rank-bronze'];
  const rankLabels = ['1st', '2nd', '3rd'];

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '24px 0 14px' }}>
        Top Streaks
      </h3>
      {activeHabits.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No habits tracked yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeHabits.map((h, i) => (
            <div key={h.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: 'var(--shadow-card)',
            }}>
              <span className={rankStyles[i]} style={{ fontSize: 18, minWidth: 28 }}>{rankLabels[i]}</span>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: h.color || '#22c55e', flexShrink: 0,
              }} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {h.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-orange)', fontWeight: 700, fontSize: 14 }}>
                <Flame size={14} />
                {h.streak}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatsPage({ habits }) {
  const activeHabits = habits.filter(h => !h.archived);
  const totalCompletions = activeHabits.reduce((s, h) => s + h.history.length, 0);
  const totalPossible = activeHabits.reduce((s, h) => {
    const created = new Date(h.createdAt);
    const today = new Date();
    const days = Math.max(1, Math.ceil((today - created) / 86400000));
    return s + days;
  }, 0);
  const rate = totalPossible === 0 ? 0 : Math.round((totalCompletions / totalPossible) * 100);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <div className="stat-chip">
          <BarChart2 size={16} color="#3b82f6" />
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{totalCompletions}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Done</span>
        </div>
        <div className="stat-chip">
          <Trophy size={16} color="#eab308" />
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{rate}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Completion</span>
        </div>
      </div>

      {/* Charts */}

      <CompletionRatePie habits={habits} />


      <Heatmap habits={habits} />
      <Leaderboard habits={habits} />
    </div>
  );
}
