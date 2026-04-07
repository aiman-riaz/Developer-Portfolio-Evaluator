import './ScoreCard.css';

const CATEGORIES = [
  { key: 'activity',    label: 'Activity',        color: '#7c6af7' },
  { key: 'codeQuality', label: 'Code Quality',     color: '#3ecfcf' },
  { key: 'diversity',   label: 'Diversity',        color: '#e85d8a' },
  { key: 'community',   label: 'Community Impact', color: '#f0a94e' },
  { key: 'hiringReady', label: 'Hiring Ready',     color: '#2dd4a0' },
];

function Ring({ value }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  const color =
    value >= 70 ? '#2dd4a0' :
    value >= 40 ? '#f0a94e' : '#e85d8a';

  return (
    <svg className="ring-svg" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={r} fill="none" stroke="#e2e2ea" strokeWidth="12" />
      <circle
        cx="90" cy="90" r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 90 90)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="90" y="85" textAnchor="middle" className="ring-value" fill={color}>
        {value}
      </text>
      <text x="90" y="108" textAnchor="middle" className="ring-label" fill="#6b6b80">
        / 100
      </text>
    </svg>
  );
}

function Bar({ label, value, color }) {
  return (
    <div className="score-bar-row">
      <div className="score-bar-meta">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-val" style={{ color }}>{value}</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ scores, name, username, avatarUrl, bio, followers, publicRepos }) {
  return (
    <div className="scorecard card fade-up">
      <div className="sc-profile">
        <img className="sc-avatar" src={avatarUrl} alt={username} />
        <div className="sc-info">
          <h2 className="sc-name">{name || username}</h2>
          <span className="sc-handle badge">@{username}</span>
          {bio && <p className="sc-bio">{bio}</p>}
          <div className="sc-stats">
            <span><strong>{followers}</strong> followers</span>
            <span><strong>{publicRepos}</strong> repos</span>
          </div>
        </div>
        <div className="sc-ring">
          <Ring value={scores.overall} />
          <p className="sc-overall-label">Overall Score</p>
        </div>
      </div>

      <div className="sc-bars">
        {CATEGORIES.map((c) => (
          <Bar
            key={c.key}
            label={c.label}
            value={scores[c.key] ?? 0}
            color={c.color}
          />
        ))}
      </div>
    </div>
  );
}
