import React, { useState, useEffect, useRef } from 'react';
import TitleBar from '../TitleBar/TitleBar';
import Sidebar from '../Sidebar/Sidebar';
import Editor from '../Editor/Editor';
import Preview from '../Preview/Preview';
import StatusBar from '../StatusBar/StatusBar';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isDirty, setIsDirty] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('untitled.md');
  const [showStatus, setShowStatus] = useState(false);
  const [markdownText, setMarkdownText] = useState(''); // 마크다운 텍스트 상태
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCursorChange = (position: { line: number; column: number }) => {
    setCursorPosition(position);
  };

  const handleTextChange = (text: string) => {
    setMarkdownText(text); // 텍스트 상태 업데이트
    setIsDirty(true);
    showStatusTemporarily();
  };

  const handleFileNameChange = (newFileName: string) => {
    setCurrentFileName(newFileName);
    setIsDirty(true);
    showStatusTemporarily();
  };

  const showStatusTemporarily = () => {
    // 상태 표시
    setShowStatus(true);

    // 이전 타이머 취소
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    // 3초 후 상태 숨기기
    statusTimerRef.current = setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

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

