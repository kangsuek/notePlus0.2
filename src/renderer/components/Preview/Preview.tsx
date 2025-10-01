import React from 'react';
import MarkdownPreview from './MarkdownPreview';
import './Preview.css';

interface PreviewProps {
  markdown?: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown = '' }) => {
  return (
    <div className="preview-section" data-testid="preview-section">
      <div className="preview-header">
        <h3>Preview</h3>
      </div>
      <div className="preview-content">
        <MarkdownPreview markdown={markdown} />
      </div>
    </div>
  );
};

export default Preview;

