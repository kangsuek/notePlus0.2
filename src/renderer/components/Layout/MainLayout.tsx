import React, { useState, useEffect, useRef, useCallback } from 'react';
import TitleBar from '../TitleBar/TitleBar';
import Sidebar from '../Sidebar/Sidebar';
import Editor from '../Editor/Editor';
import Preview from '../Preview/Preview';
import StatusBar from '../StatusBar/StatusBar';
import { UI_CONFIG, FILE_CONFIG, EDITOR_CONFIG } from '@renderer/constants';
import type { CursorPosition } from '@renderer/types';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const [isDirty, setIsDirty] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>(FILE_CONFIG.DEFAULT_FILENAME);
  const [showStatus, setShowStatus] = useState(false);
  const [markdownText, setMarkdownText] = useState(''); // 마크다운 텍스트 상태
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 상태 표시 함수 (useCallback으로 메모이제이션)
  const showStatusTemporarily = useCallback(() => {
    // 상태 표시
    setShowStatus(true);

    // 이전 타이머 취소
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    // STATUS_DISPLAY_DURATION 후 상태 숨기기
    statusTimerRef.current = setTimeout(() => {
      setShowStatus(false);
    }, UI_CONFIG.STATUS_DISPLAY_DURATION);
  }, []);

  const handleCursorChange = useCallback((position: CursorPosition) => {
    setCursorPosition(position);
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setMarkdownText(text); // 텍스트 상태 업데이트
    setIsDirty(true);
    showStatusTemporarily();
  }, [showStatusTemporarily]);

  const handleFileNameChange = useCallback((newFileName: string) => {
    setCurrentFileName(newFileName);
    setIsDirty(true);
    showStatusTemporarily();
  }, [showStatusTemporarily]);

  // 클린업
  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="main-layout" data-testid="main-layout">
      <TitleBar />
      <div className="main-content">
        <Sidebar
          currentFileName={currentFileName}
          onFileNameChange={handleFileNameChange}
          isDirty={isDirty}
        />
        <Editor
          onCursorChange={handleCursorChange}
          onChange={handleTextChange}
          debounceMs={EDITOR_CONFIG.DEBOUNCE_MS}
        />
        <Preview markdown={markdownText} />
      </div>
      <StatusBar
        cursorPosition={cursorPosition}
        isDirty={isDirty}
        showStatus={showStatus}
      />
    </div>
  );
};

export default MainLayout;

