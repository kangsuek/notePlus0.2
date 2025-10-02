import React, { useState, useEffect, useRef, useCallback } from 'react';
import TitleBar from '../TitleBar/TitleBar';
import Sidebar from '../Sidebar/Sidebar';
import Editor from '../Editor/Editor';
import Preview from '../Preview/Preview';
import StatusBar from '../StatusBar/StatusBar';
import { UI_CONFIG, FILE_CONFIG, EDITOR_CONFIG } from '@renderer/constants';
import type { CursorPosition } from '@renderer/types';
import { rafThrottle } from '@renderer/utils/throttle';
import { saveFile, saveFileAs, openFile, readFile } from '@renderer/utils/fileOperations';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const [isDirty, setIsDirty] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>(FILE_CONFIG.DEFAULT_FILENAME);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [markdownText, setMarkdownText] = useState(''); // 마크다운 텍스트 상태
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 스크롤 동기화를 위한 ref
  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isEditorScrolling = useRef(false);
  const isPreviewScrolling = useRef(false);

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

  const handleTextChange = useCallback(
    (text: string) => {
      setMarkdownText(text); // 텍스트 상태 업데이트
      setIsDirty(true);
      showStatusTemporarily();
    },
    [showStatusTemporarily]
  );

  const handleFileNameChange = useCallback(
    (newFileName: string) => {
      setCurrentFileName(newFileName);
      setIsDirty(true);
      showStatusTemporarily();
    },
    [showStatusTemporarily]
  );

  // Editor 스크롤 → Preview 동기화 (스크롤 비율 기반)
  const handleEditorScroll = useCallback(
    rafThrottle(() => {
      if (isPreviewScrolling.current || !editorTextareaRef.current || !previewRef.current) {
        return;
      }

      isEditorScrolling.current = true;

      const editor = editorTextareaRef.current;
      const preview = previewRef.current;

      const editorScrollTop = editor.scrollTop;
      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

      let previewScrollTop: number;

      // 경계 케이스 처리 (맨 위/맨 아래)
      if (editorScrollTop <= 1) {
        // 맨 위
        previewScrollTop = 0;
      } else if (editorScrollTop >= editorMaxScroll - 1) {
        // 맨 아래 (1px 허용 오차)
        previewScrollTop = previewMaxScroll;
      } else {
        // 중간: 비율 계산 (0~1 범위로 clamp)
        const scrollRatio = Math.min(1, Math.max(0, editorScrollTop / (editorMaxScroll || 1)));
        previewScrollTop = scrollRatio * previewMaxScroll;
      }

      // Preview 스크롤 적용 (반올림)
      preview.scrollTop = Math.round(previewScrollTop);

      // 플래그 리셋
      setTimeout(() => {
        isEditorScrolling.current = false;
      }, 100);
    }),
    []
  );

  // Preview 스크롤 → Editor 동기화 (스크롤 비율 기반)
  const handlePreviewScroll = useCallback(
    rafThrottle(() => {
      if (isEditorScrolling.current || !previewRef.current || !editorTextareaRef.current) {
        return;
      }

      isPreviewScrolling.current = true;

      const preview = previewRef.current;
      const editor = editorTextareaRef.current;

      const previewScrollTop = preview.scrollTop;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;
      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;

      let editorScrollTop: number;

      // 경계 케이스 처리 (맨 위/맨 아래)
      if (previewScrollTop <= 1) {
        // 맨 위
        editorScrollTop = 0;
      } else if (previewScrollTop >= previewMaxScroll - 1) {
        // 맨 아래 (1px 허용 오차)
        editorScrollTop = editorMaxScroll;
      } else {
        // 중간: 비율 계산 (0~1 범위로 clamp)
        const scrollRatio = Math.min(1, Math.max(0, previewScrollTop / (previewMaxScroll || 1)));
        editorScrollTop = scrollRatio * editorMaxScroll;
      }

      // Editor 스크롤 적용 (반올림)
      editor.scrollTop = Math.round(editorScrollTop);

      // 플래그 리셋
      setTimeout(() => {
        isPreviewScrolling.current = false;
      }, 100);
    }),
    []
  );

  // 파일 저장 (Cmd+S)
  const handleSave = useCallback(async () => {
    if (currentFilePath) {
      // 기존 파일에 저장
      const result = await saveFile(currentFilePath, markdownText);
      if (result.success) {
        setIsDirty(false);
        showStatusTemporarily();
      } else {
        console.error('Failed to save file:', result.error);
      }
    } else {
      // 새 파일 - Save As
      const result = await saveFileAs(markdownText);
      if (result.success && result.filePath) {
        setCurrentFilePath(result.filePath);
        const fileName = result.filePath.split('/').pop() || FILE_CONFIG.DEFAULT_FILENAME;
        setCurrentFileName(fileName);
        setIsDirty(false);
        showStatusTemporarily();
      }
    }
  }, [currentFilePath, markdownText, showStatusTemporarily]);

  // 파일 열기 (Cmd+O)
  const handleOpen = useCallback(async () => {
    const result = await openFile();
    if (result.success && result.content && result.filePath) {
      setMarkdownText(result.content);
      setCurrentFilePath(result.filePath);
      const fileName = result.filePath.split('/').pop() || FILE_CONFIG.DEFAULT_FILENAME;
      setCurrentFileName(fileName);
      setIsDirty(false);
    }
  }, []);

  // 최근 파일에서 파일 열기 (Sidebar에서 더블클릭)
  const handleFileOpen = useCallback(async (filePath: string) => {
    const result = await readFile(filePath);
    if (result.success && result.content) {
      setMarkdownText(result.content);
      setCurrentFilePath(filePath);
      const fileName = filePath.split('/').pop() || FILE_CONFIG.DEFAULT_FILENAME;
      setCurrentFileName(fileName);
      setIsDirty(false);
    } else {
      console.error('Failed to open file:', result.error);
    }
  }, []);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S (macOS) 또는 Ctrl+S (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Cmd+O (macOS) 또는 Ctrl+O (Windows/Linux)
      else if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handleOpen]);

  // 창 닫기 전 확인 (저장하지 않은 변경사항이 있을 경우)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | undefined => {
      if (isDirty) {
        e.preventDefault();
        // Chrome에서는 returnValue를 설정해야 함
        e.returnValue = '';
        return '';
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

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
          onFileOpen={handleFileOpen}
        />
        <Editor
          value={markdownText}
          onCursorChange={handleCursorChange}
          onChange={handleTextChange}
          debounceMs={EDITOR_CONFIG.DEBOUNCE_MS}
          onScroll={handleEditorScroll}
          onTextareaRef={(ref) => {
            editorTextareaRef.current = ref;
          }}
        />
        <Preview markdown={markdownText} ref={previewRef} onScroll={handlePreviewScroll} />
      </div>
      <StatusBar cursorPosition={cursorPosition} isDirty={isDirty} showStatus={showStatus} />
    </div>
  );
};

export default MainLayout;
