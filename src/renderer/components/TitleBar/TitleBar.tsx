import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './TitleBar.css';

interface TitleBarProps {
  title?: string;
  onPreviewToggle?: () => void;
  isPreviewVisible?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title = 'notePlus',
  onPreviewToggle,
  isPreviewVisible = true,
}) => {
  return (
    <div className="title-bar" data-testid="title-bar">
      <div className="title-bar-drag-region">
        <span className="title-bar-title">{title}</span>
      </div>
      <div className="title-bar-controls">
        {onPreviewToggle && (
          <button
            className="title-bar-icon preview-toggle-icon"
            onClick={onPreviewToggle}
            title={isPreviewVisible ? '미리보기 끄기' : '미리보기 켜기'}
            aria-label={isPreviewVisible ? '미리보기 끄기' : '미리보기 켜기'}
          >
            {isPreviewVisible ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <circle cx="10" cy="13" r="2" />
                <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TitleBar;
