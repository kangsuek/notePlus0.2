import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRefresh = () => {
    // 최근 문서 목록 새로고침 로직 (추후 구현)
  };

  const handleDelete = () => {
    // 선택된 문서 삭제 로직 (추후 구현)
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      data-testid="sidebar"
    >
      <div className="sidebar-header">
        <div className="sidebar-title">
          <button
            className="toggle-button"
            onClick={handleToggle}
            title="접기/펼치기"
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
          <h3>최근 문서 (0)</h3>
        </div>
        <div className="sidebar-actions">
          <button onClick={handleRefresh} title="새로고침">
            🔄
          </button>
          <button onClick={handleDelete} title="삭제">
            🗑️
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="sidebar-content" data-testid="file-list">
          <div className="empty-state">
            <p>최근 문서가 없습니다</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

