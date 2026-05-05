import { useMemo } from 'react';
import { CheckCircle, Trophy, Zap } from 'lucide-react';
import { formatDate, getDailyQuote } from './constants';

function ProgressRing({ done, total }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : done / total;
  const offset = circ * (1 - pct);

  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          strokeWidth="10"
          className="progress-ring-track"
          stroke="var(--border)"
        />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="progress-ring-fill"
          stroke="#22c55e"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {Math.round(pct * 100)}%
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-chip">
      <Icon size={16} color={color || 'var(--accent)'} />
      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

export default function HeroCard({ stats }) {
  const quote = useMemo(() => getDailyQuote(), []);
  const dateStr = useMemo(() => formatDate(), []);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(13,148,136,0.06) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '24px 20px',
        margin: '16px 0 8px',
      }}
    >
      {/* Date */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, margin: '0 0 16px' }}>
        {dateStr}
      </p>

      {/* Ring + Quote row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <ProgressRing done={stats.done} total={stats.total} />
        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            "{quote}"
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <StatChip icon={CheckCircle} label="Done" value={stats.done} color="#22c55e" />
        <StatChip icon={Trophy} label="Best Streak" value={stats.bestStreak} color="#eab308" />
        <StatChip icon={Zap} label="Current" value={stats.currentStreak} color="#f97316" />
      </div>
    </div>
  );
}
