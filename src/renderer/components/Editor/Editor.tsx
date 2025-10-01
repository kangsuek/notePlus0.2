import React, { useState, useCallback, useRef, useEffect } from 'react';
import LineNumbers from './LineNumbers';
import './Editor.css';

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onCursorChange?: (position: { line: number; column: number }) => void;
  debounceMs?: number;
}

const Editor: React.FC<EditorProps> = ({
  value: controlledValue,
  onChange,
  onCursorChange,
  debounceMs = 0
}) => {
  const [text, setText] = useState(controlledValue || '');
  const [currentLine, setCurrentLine] = useState(1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // 라인 수 계산
  const lineCount = text.split('\n').length;

  // 커서 위치 계산
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const lastLine = lines[lines.length - 1];
    const column = lastLine ? lastLine.length + 1 : 1;

    setCurrentLine(line);

    if (onCursorChange) {
      onCursorChange({ line, column });
    }
  }, [text, onCursorChange]);

  // 텍스트 변경 핸들러 (디바운싱 적용)
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);

    if (onChange) {
      if (debounceMs > 0) {
        // 디바운싱: 이전 타이머 취소
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        // 새 타이머 설정
        debounceTimerRef.current = setTimeout(() => {
          onChange(newValue);
        }, debounceMs);
      } else {
        // 디바운싱 없이 즉시 호출
        onChange(newValue);
      }
    }
  }, [onChange, debounceMs]);

  // 스크롤 동기화 핸들러
  const handleScroll = useCallback(() => {
    if (!textareaRef.current || !lineNumbersRef.current) return;

    // textarea의 스크롤을 line numbers에 동기화
    lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
  }, []);

  // 클릭 또는 키보드 이벤트 시 커서 위치 업데이트
  const handleCursorUpdate = useCallback(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);

  // Tab 키 처리: 스페이스 2칸 삽입
  const handleTab = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const spaces = '  '; // 2 스페이스

    const newValue = text.substring(0, start) + spaces + text.substring(end);
    setText(newValue);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      updateCursorPosition();
    }, 0);

    // onChange 호출
    if (onChange) {
      onChange(newValue);
    }
  }, [text, onChange, updateCursorPosition]);

  // Enter 키 처리: 자동 들여쓰기
  const handleEnter = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const textBeforeEnter = text.substring(0, start);
    const lines = textBeforeEnter.split('\n');
    const currentLineText = lines[lines.length - 1] || '';

    // 현재 줄의 들여쓰기 감지
    const indentMatch = currentLineText.match(/^(\s+)/);
    const indent = indentMatch?.[1] || '';

    // 들여쓰기가 있는 경우에만 처리
    if (indent && indent.length > 0) {
      e.preventDefault();
      const end = textarea.selectionEnd;
      const newValue = text.substring(0, start) + '\n' + indent + text.substring(end);
      setText(newValue);

      // 커서 위치 조정
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
        updateCursorPosition();
      }, 0);

      // onChange 호출
      if (onChange) {
        onChange(newValue);
      }
    }
  }, [text, onChange, updateCursorPosition]);

  // 단축키 처리: Cmd+B, Cmd+I, Cmd+K
  const handleShortcut = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    let newValue = text;
    let newCursorPos = start;

    // Cmd+B: Bold
    if (e.metaKey && e.key === 'b') {
      e.preventDefault();
      const wrapper = '**';
      newValue = text.substring(0, start) + wrapper + selectedText + wrapper + text.substring(end);
      newCursorPos = selectedText ? end + wrapper.length * 2 : start + wrapper.length;
    }
    // Cmd+I: Italic
    else if (e.metaKey && e.key === 'i') {
      e.preventDefault();
      const wrapper = '*';
      newValue = text.substring(0, start) + wrapper + selectedText + wrapper + text.substring(end);
      newCursorPos = selectedText ? end + wrapper.length * 2 : start + wrapper.length;
    }
    // Cmd+K: Link
    else if (e.metaKey && e.key === 'k') {
      e.preventDefault();
      const linkText = selectedText || 'text';
      const linkMarkdown = `[${linkText}](url)`;
      newValue = text.substring(0, start) + linkMarkdown + text.substring(end);
      newCursorPos = start + linkMarkdown.length;
    }
    else {
      return; // 단축키가 아니면 아무것도 하지 않음
    }

    setText(newValue);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      updateCursorPosition();
    }, 0);

    // onChange 호출
    if (onChange) {
      onChange(newValue);
    }
  }, [text, onChange, updateCursorPosition]);

  // 키보드 이벤트 통합 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      handleTab(e);
    } else if (e.key === 'Enter') {
      handleEnter(e);
    } else {
      handleShortcut(e);
    }
  }, [handleTab, handleEnter, handleShortcut]);

  // 클린업: 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 외부에서 value가 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== text) {
      setText(controlledValue);
    }
  }, [controlledValue]);

  return (
    <div className="editor-section" data-testid="editor-section">
      <div className="editor-header">
        <h3>Editor</h3>
      </div>
      <div className="editor-container">
        <div ref={lineNumbersRef} className="line-numbers-wrapper">
          <LineNumbers lineCount={lineCount} currentLine={currentLine} />
        </div>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          placeholder="마크다운으로 작성하세요..."
          value={text}
          onChange={handleTextChange}
          onScroll={handleScroll}
          onClick={handleCursorUpdate}
          onKeyUp={handleCursorUpdate}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default Editor;

