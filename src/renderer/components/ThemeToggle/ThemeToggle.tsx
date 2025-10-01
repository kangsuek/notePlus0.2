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
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;

