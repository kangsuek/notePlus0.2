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
import { shouldShowPreview } from '@renderer/utils/fileUtils';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 1, column: 1 });
  const [isDirty, setIsDirty] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>(FILE_CONFIG.DEFAULT_FILENAME);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [markdownText, setMarkdownText] = useState(''); // 마크다운 텍스트 상태
  const [showPreview, setShowPreview] = useState(true); // 프리뷰 표시 여부
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

      // 파일 확장자에 따라 프리뷰 표시 여부 결정
      setShowPreview(shouldShowPreview(result.filePath));
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

      // 파일 확장자에 따라 프리뷰 표시 여부 결정
      setShowPreview(shouldShowPreview(filePath));
    } else {
      console.error('Failed to open file:', result.error);
    }
  }, []);

  // 새 파일 생성 (Cmd+N)
  const handleNew = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('저장하지 않은 변경사항이 있습니다. 계속하시겠습니까?');
      if (!confirmed) return;
    }

    setMarkdownText('');
    setCurrentFilePath(null);
    setCurrentFileName(FILE_CONFIG.DEFAULT_FILENAME);
    setIsDirty(false);

    // 새 파일은 기본적으로 프리뷰 표시 (untitled.md)
    setShowPreview(true);
  }, [isDirty]);

  // 다른 이름으로 저장 (Cmd+Shift+S)
  const handleSaveAs = useCallback(async () => {
    const result = await saveFileAs(markdownText);
    if (result.success && result.filePath) {
      setCurrentFilePath(result.filePath);
      const fileName = result.filePath.split('/').pop() || FILE_CONFIG.DEFAULT_FILENAME;
      setCurrentFileName(fileName);
      setIsDirty(false);
      showStatusTemporarily();

      // 저장된 파일 확장자에 따라 프리뷰 표시 여부 결정
      setShowPreview(shouldShowPreview(result.filePath));
    }
  }, [markdownText, showStatusTemporarily]);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+N (macOS) 또는 Ctrl+N (Windows/Linux) - 새 파일
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      }
      // Cmd+S (macOS) 또는 Ctrl+S (Windows/Linux) - 저장
      else if ((e.metaKey || e.ctrlKey) && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      // Cmd+Shift+S (macOS) 또는 Ctrl+Shift+S (Windows/Linux) - 다른 이름으로 저장
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        handleSaveAs();
      }
      // Cmd+O (macOS) 또는 Ctrl+O (Windows/Linux) - 열기
      else if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNew, handleSave, handleSaveAs, handleOpen]);

  // 메뉴 이벤트 리스너 (IPC)
  useEffect(() => {
    if (!window.electronAPI) return;

    // 메뉴 → 새 파일
    window.electronAPI.on('menu:new-file', () => {
      handleNew();
    });

    // 메뉴 → 열기
    window.electronAPI.on('menu:open-file', () => {
      handleOpen();
    });

    // 메뉴 → 저장
    window.electronAPI.on('menu:save-file', () => {
      handleSave();
    });

    // 메뉴 → 다른 이름으로 저장
    window.electronAPI.on('menu:save-file-as', () => {
      handleSaveAs();
    });

    // 메뉴 → 사이드바 토글
    window.electronAPI.on('menu:toggle-sidebar', () => {
      // TODO: Sidebar 토글 구현
      console.log('Toggle sidebar');
    });

    // 정리: IPC 리스너 제거는 electron에서 자동으로 처리됨
  }, [handleNew, handleOpen, handleSave, handleSaveAs]);

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
      <div className={`main-content ${!showPreview ? 'preview-hidden' : ''}`}>
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
        {showPreview && (
          <Preview markdown={markdownText} ref={previewRef} onScroll={handlePreviewScroll} />
        )}
      </div>
      <StatusBar cursorPosition={cursorPosition} isDirty={isDirty} showStatus={showStatus} />
    </div>
  );
};

export default MainLayout;
