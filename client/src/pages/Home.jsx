import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import './Home.css';
const EXAMPLES = ['torvalds', 'gaearon', 'yyx990803', 'antfu', 'sindresorhus'];
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-bg"></div>
      <div className="home-content container">
        <header className="home-header">
          <div className="logo-mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="url(#grad)" />
              <path d="M18 7 L27 12.5 L27 23.5 L18 29 L9 23.5 L9 12.5 Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M18 7 L18 18 L27 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12.5 L18 18 L18 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 23.5 L18 18 L27 23.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="18" r="2.5" fill="white" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6b5aed" />
                  <stop offset="1" stopColor="#d64d7b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">DevScore</span>
        </header>
        <div className="hero">
          <h1 className="hero-title">
            Evaluate <span className="hero-gradient">GitHub</span> profiles
          </h1>
          <SearchBar />
          <div className="examples">
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
          <ul className="simple-features">
            <li>Activity Heatmaps</li>
            <li>5-Category Scoring</li>
            <li>Profile Comparisons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
