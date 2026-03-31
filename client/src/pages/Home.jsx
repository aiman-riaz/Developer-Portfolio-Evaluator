import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import './Home.css';
const EXAMPLES = ['torvalds', 'gaearon', 'yyx990803', 'antfu', 'sindresorhus'];
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="grid-overlay" />
      </div>
      <div className="home-content container">
        <header className="home-header">
          <div className="logo-mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#7c6af7" />
              <path d="M10 26l8-16 8 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 21h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">DevScore</span>
        </header>
        <div className="hero">
          <div className="hero-tag badge">Free · No AI Subscription · GitHub API</div>
          <h1 className="hero-title">
            Analyse any GitHub <br />
            <span className="hero-gradient">developer profile</span>
          </h1>
          <p className="hero-sub">
            Get a detailed scorecard covering activity, code quality, diversity,
            community impact and hiring readiness — all from public data.
          </p>
          <SearchBar />
          <div className="examples">
            <span className="examples-label">Try:</span>
            {EXAMPLES.map((u) => (
              <button
                key={u}
                className="example-chip"
                onClick={() => navigate(`/report/${u}`)}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="features">
          {[
            { icon: '📊', title: 'Live Scoring', desc: '5 weighted categories, computed in real time' },
            { icon: '📅', title: 'Activity Heatmap', desc: 'GitHub-style contribution calendar' },
            { icon: '🔗', title: 'Shareable URL', desc: 'Every report gets a unique link for LinkedIn' },
            { icon: '⚡', title: '24-hr Cache', desc: 'MongoDB-backed, no repeat API hits' },
          ].map((f) => (
            <div key={f.title} className="feature-card card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
