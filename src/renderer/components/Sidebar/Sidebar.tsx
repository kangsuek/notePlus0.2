import React, { useState, useRef, useEffect } from 'react';
import { getFileNameError } from '@renderer/utils/fileNameValidator';
import { FILE_CONFIG } from '@renderer/constants';
import type { SidebarProps } from '@renderer/types';
import './Sidebar.css';

const Sidebar: React.FC<SidebarProps> = ({ 
  currentFileName = FILE_CONFIG.DEFAULT_FILENAME,
  onFileNameChange,
  isDirty = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [editedFileName, setEditedFileName] = useState(currentFileName);
  const [fileNameError, setFileNameError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일명이 외부에서 변경되면 동기화
  useEffect(() => {
    setEditedFileName(currentFileName);
  }, [currentFileName]);

  // 편집 모드 진입 시 입력 필드에 포커스
  useEffect(() => {
    if (isEditingFileName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingFileName]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRefresh = () => {
    // 최근 문서 목록 새로고침 로직 (추후 구현)
  };

  const handleDelete = () => {
    // 선택된 문서 삭제 로직 (추후 구현)
  };

  const handleFileNameClick = () => {
    setIsEditingFileName(true);
  };

  const handleFileNameSave = () => {
    const trimmed = editedFileName.trim();

    // 파일명 검증
    const error = getFileNameError(trimmed);
    if (error) {
      setFileNameError(error);
      return; // 편집 모드 유지
    }

    // 유효한 파일명이고 변경되었으면 저장
    if (trimmed && trimmed !== currentFileName) {
      onFileNameChange?.(trimmed);
    }

    setFileNameError(null);
    setIsEditingFileName(false);
  };

  const handleFileNameCancel = () => {
    setEditedFileName(currentFileName);
    setFileNameError(null);
    setIsEditingFileName(false);
  };

  const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFileNameSave();
    } else if (e.key === 'Escape') {
      handleFileNameCancel();
    }
  };

  const handleFileNameBlur = () => {
    handleFileNameSave();
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      data-testid="sidebar"
    >
      {/* 파일명 섹션 */}
      <div className="sidebar-filename-section">
        <div className="filename-wrapper">
          {isEditingFileName ? (
            <>
              <input
                ref={inputRef}
                type="text"
                className={`filename-input ${fileNameError ? 'filename-input-error' : ''}`}
                value={editedFileName}
                onChange={(e) => setEditedFileName(e.target.value)}
                onKeyDown={handleFileNameKeyDown}
                onBlur={handleFileNameBlur}
                aria-invalid={!!fileNameError}
                aria-describedby={fileNameError ? 'filename-error' : undefined}
              />
              {fileNameError && (
                <div className="filename-error" id="filename-error" role="alert">
                  {fileNameError}
                </div>
              )}
            </>
          ) : (
            <div
              className="filename-display"
              onClick={handleFileNameClick}
              title="클릭하여 파일명 변경"
            >
              {currentFileName}{isDirty ? ' *' : ''}
            </div>
          )}
        </div>
      </div>

      {/* 최근 문서 헤더 */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <button
            className="toggle-button"
            onClick={handleToggle}
            title="접기/펼치기"
            aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
          <h3>최근 문서 (0)</h3>
        </div>
        <div className="sidebar-actions">
          <button onClick={handleRefresh} title="새로고침" aria-label="최근 문서 새로고침">
            🔄
          </button>
          <button onClick={handleDelete} title="삭제" aria-label="선택된 문서 삭제">
            🗑️
          </button>
        </div>
      </div>

      {/* 파일 목록 */}
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

