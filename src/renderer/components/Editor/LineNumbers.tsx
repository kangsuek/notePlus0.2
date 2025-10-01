import React from 'react';

interface LineNumbersProps {
  lineCount: number;
  currentLine?: number;
}

const LineNumbers: React.FC<LineNumbersProps> = ({ lineCount, currentLine }) => {
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="line-numbers" data-testid="line-numbers">
      {lineNumbers.map((num) => (
        <div
          key={num}
          className={`line-number ${num === currentLine ? 'line-number-active' : ''}`}
          data-testid={`line-number-${num}`}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export default LineNumbers;

