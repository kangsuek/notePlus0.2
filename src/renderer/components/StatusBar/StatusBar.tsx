import React from 'react';
import './StatusBar.css';

interface CursorPosition {
  line: number;
  column: number;
}

interface StatusBarProps {
  cursorPosition?: CursorPosition;
  encoding?: string;
  isDirty?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  cursorPosition = { line: 1, column: 1 },
  encoding = 'UTF-8',
  isDirty = false,
}) => {
  return (
    <div className="status-bar" data-testid="status-bar">
      <div className="status-left">
        <span>줄 {cursorPosition.line}, 칸 {cursorPosition.column}</span>
      </div>
      <div className="status-center">
        {/* 가운데 영역 (필요시 추가) */}
      </div>
      <div className="status-right">
        <span className="status-modified">
          {isDirty ? '수정됨' : '저장됨'}
        </span>
        <span className="status-encoding">{encoding}</span>
      </div>
    </div>
  );
};

export default StatusBar;

