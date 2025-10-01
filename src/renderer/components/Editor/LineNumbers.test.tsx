import { render, screen } from '@/__tests__/test-utils';
import LineNumbers from './LineNumbers';

describe('LineNumbers', () => {
  it('should render without crashing', () => {
    render(<LineNumbers lineCount={1} />);
    expect(screen.getByTestId('line-numbers')).toBeInTheDocument();
  });

  it('should render correct number of lines', () => {
    render(<LineNumbers lineCount={5} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render at least 1 line when lineCount is 0', () => {
    render(<LineNumbers lineCount={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should highlight current line', () => {
    render(<LineNumbers lineCount={5} currentLine={3} />);

    const line3 = screen.getByTestId('line-number-3');
    expect(line3).toHaveClass('line-number-active');
  });

  it('should not highlight any line when currentLine is not provided', () => {
    render(<LineNumbers lineCount={5} />);

    const line1 = screen.getByTestId('line-number-1');
    const line2 = screen.getByTestId('line-number-2');

    expect(line1).not.toHaveClass('line-number-active');
    expect(line2).not.toHaveClass('line-number-active');
  });

  it('should update line numbers when lineCount changes', () => {
    const { rerender } = render(<LineNumbers lineCount={3} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();

    // lineCount 변경
    rerender(<LineNumbers lineCount={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

