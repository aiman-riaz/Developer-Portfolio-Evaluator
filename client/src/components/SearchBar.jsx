import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
export default function SearchBar({ initialValue = '' }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter a GitHub username.');
      return;
    }
    setError('');
    navigate(`/report/${trimmed}`);
  };
  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="search-wrap">
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          className="search-input"
          type="text"
          placeholder="Enter GitHub username…"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          autoComplete="off"
          spellCheck="false"
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </div>
      {error && <p className="search-error">{error}</p>}
    </form>
  );
}
