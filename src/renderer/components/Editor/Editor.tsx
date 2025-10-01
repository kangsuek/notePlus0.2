import React from 'react';
import './Editor.css';

const Editor: React.FC = () => {
  return (
    <div className="editor-section" data-testid="editor-section">
      <div className="editor-header">
        <h3>Editor</h3>
      </div>
      <div className="editor-container">
        <div className="line-numbers">
          <div className="line-number">1</div>
        </div>
        <textarea
          className="editor-textarea"
          placeholder="마크다운으로 작성하세요..."
          defaultValue=""
        />
      </div>
    </div>
  );
};

export default Editor;

