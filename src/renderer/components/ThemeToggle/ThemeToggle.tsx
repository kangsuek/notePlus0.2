import React from 'react';
import { useTheme } from '@renderer/hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`현재: ${theme === 'light' ? '라이트 모드' : '다크 모드'}`}
      data-testid="theme-toggle"
    >
      <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
      <span className="theme-label">
        {theme === 'light' ? '라이트 모드' : '다크 모드'}
      </span>
    </button>
  );
};

export default ThemeToggle;

