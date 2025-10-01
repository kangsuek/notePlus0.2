import React from 'react';
import './Preview.css';

const Preview: React.FC = () => {
  return (
    <div className="preview-section" data-testid="preview-section">
      <div className="preview-header">
        <h3>Preview</h3>
      </div>
      <div className="preview-content">
        <h1>notePlus</h1>
        <p>마크다운 프리뷰가 여기 표시됩니다.</p>
      </div>
    </div>
  );
};

export default Preview;

