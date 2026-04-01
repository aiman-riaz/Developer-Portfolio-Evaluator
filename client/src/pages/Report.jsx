import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfile, fetchCompare } from '../utils/api.js';
import SearchBar from '../components/SearchBar.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import RadarChart from '../components/RadarChart.jsx';
import HeatMap from '../components/HeatMap.jsx';
import RepoList from '../components/RepoList.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import './Report.css';
function Loader() {
  return (
    <div className="loader-wrap">
      <div className="loader-ring" />
      <p className="loader-text">Fetching GitHub data…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state card">
      <span className="error-icon">⚠️</span>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>Try again</button>
    </div>
  );
}

export default function Report() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [report, setReport]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [copied, setCopied]         = useState(false);
  const [fromCache, setFromCache]   = useState(false);
  const [compareInput, setCompareInput]   = useState('');
  const [compareReport, setCompareReport] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError]   = useState('');
  const [showCompare, setShowCompare]     = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchProfile(username);
      setReport(res.data);
      setFromCache(res.cached);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [username]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompare = async () => {
    if (!compareInput.trim()) return;
    setCompareLoading(true);
    setCompareError('');
    try {
      const res = await fetchCompare(username, compareInput.trim());
      setCompareReport(res.data[1]);
      setShowCompare(true);
    } catch (e) {
      setCompareError(e.response?.data?.error || 'Could not load comparison.');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
      </div>

      <div className="report-container container">
        {/* Top nav */}
        <header className="report-nav">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← DevScore
          </button>
          <SearchBar initialValue={username} />
          <div className="nav-actions">
            {fromCache && <span className="cache-badge badge">Cached</span>}
            <button className="copy-btn" onClick={copyLink}>
              {copied ? '✓ Copied!' : '🔗 Share'}
            </button>
          </div>
        </header>

        {loading && <Loader />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && report && (
          <>
            <div className="report-top">
              <ScoreCard {...report} />
              <RadarChart
                scores={report.scores}
                username={report.username}
                compareScores={showCompare ? compareReport?.scores : null}
                compareUsername={showCompare ? compareReport?.username : null}
              />
            </div>

            <HeatMap heatmapData={report.heatmapData} />

            <div className="report-bottom">
              <LanguageChart languages={report.languages} />
              <RepoList repos={report.topRepos} />
            </div>

            
            <div className="compare-section card fade-up">
              <h3 className="compare-title">⚔️ Compare Mode</h3>
              <p className="compare-sub">Enter another GitHub username to overlay their scores.</p>
              <div className="compare-controls">
                <input
                  className="compare-input"
                  type="text"
                  placeholder="GitHub username…"
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                />
                <button
                  className="compare-btn"
                  onClick={handleCompare}
                  disabled={compareLoading}
                >
                  {compareLoading ? 'Loading…' : 'Compare'}
                </button>
              </div>
              {compareError && <p className="compare-error">{compareError}</p>}

              {showCompare && compareReport && (
                <div className="compare-results">
                  <div className="compare-header">
                    <div className="compare-user">
                      <img src={report.avatarUrl} alt={report.username} className="compare-avatar" />
                      <strong>@{report.username}</strong>
                      <span className="compare-score" style={{ color: '#7c6af7' }}>
                        {report.scores.overall}
                      </span>
                    </div>
                    <span className="vs-label">VS</span>
                    <div className="compare-user">
                      <img src={compareReport.avatarUrl} alt={compareReport.username} className="compare-avatar" />
                      <strong>@{compareReport.username}</strong>
                      <span className="compare-score" style={{ color: '#e85d8a' }}>
                        {compareReport.scores.overall}
                      </span>
                    </div>
                  </div>

                  <div className="compare-table">
                    {['activity','codeQuality','diversity','community','hiringReady'].map((key) => {
                      const labels = {
                        activity: 'Activity', codeQuality: 'Code Quality',
                        diversity: 'Diversity', community: 'Community', hiringReady: 'Hiring Ready'
                      };
                      const s1 = report.scores[key];
                      const s2 = compareReport.scores[key];
                      return (
                        <div key={key} className="compare-row">
                          <span className={`compare-cell ${s1 > s2 ? 'winner' : ''}`}>{s1}</span>
                          <span className="compare-cat">{labels[key]}</span>
                          <span className={`compare-cell ${s2 > s1 ? 'winner' : ''}`}>{s2}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
