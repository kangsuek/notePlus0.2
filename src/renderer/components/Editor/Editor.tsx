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
        />
      </div>
    </div>
  );
};

export default Editor;

