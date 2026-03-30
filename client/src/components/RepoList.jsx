import './RepoList.css';

const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#FA7343',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dart: '#00B4AB',
};

function LangPill({ lang }) {
  const color = LANG_COLORS[lang] || '#7c6af7';
  return (
    <span className="lang-pill" style={{ borderColor: color + '60', color }}>
      <span className="lang-dot" style={{ background: color }} />
      {lang}
    </span>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="18" r="2" /><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" />
      <path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M12 12v4" />
    </svg>
  );
}

export default function RepoList({ repos = [] }) {
  if (!repos.length) return null;
  return (
    <div className="card fade-up">
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
        Top Repositories
      </h3>
      <div className="repo-grid">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-card"
          >
            <div className="repo-top">
              <span className="repo-name">{repo.name}</span>
              {repo.language && <LangPill lang={repo.language} />}
            </div>
            {repo.description && (
              <p className="repo-desc">{repo.description}</p>
            )}
            <div className="repo-stats">
              <span className="repo-stat"><StarIcon /> {repo.stars ?? 0}</span>
              <span className="repo-stat"><ForkIcon /> {repo.forks ?? 0}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
