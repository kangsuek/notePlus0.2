import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './TitleBar.css';

interface TitleBarProps {
  title?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title = 'notePlus' }) => {
  return (
    <div className="title-bar" data-testid="title-bar">
      <div className="title-bar-drag-region">
        <span className="title-bar-title">{title}</span>
      </div>
      <div className="title-bar-controls">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TitleBar;

