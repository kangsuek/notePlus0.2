import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import Editor from './Editor';

describe('Editor', () => {
  it('should render without crashing', () => {
    render(<Editor />);
    expect(screen.getByTestId('editor-section')).toBeInTheDocument();
  });

  it('should render editor header', () => {
    render(<Editor />);
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });

  it('should render textarea', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');
    expect(textarea).toBeInTheDocument();
  });

  it('should handle text input', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');

    fireEvent.change(textarea, { target: { value: '# Hello World' } });
    expect(textarea).toHaveValue('# Hello World');
  });

  it('should update line numbers when text changes', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');

    // 초기 상태: 1줄
    expect(screen.getByText('1')).toBeInTheDocument();

    // 3줄 입력
    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3' } });

    // 라인 넘버가 3개 있어야 함
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should call onChange handler', () => {
    const handleChange = jest.fn();
    render(<Editor onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');
    fireEvent.change(textarea, { target: { value: 'Test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should debounce onChange calls', async () => {
    const handleChange = jest.fn();
    render(<Editor onChange={handleChange} debounceMs={300} />);

    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');

    // 빠르게 여러 번 입력
    fireEvent.change(textarea, { target: { value: 'T' } });
    fireEvent.change(textarea, { target: { value: 'Te' } });
    fireEvent.change(textarea, { target: { value: 'Test' } });

    // 디바운스되어 마지막 호출만 실행되어야 함
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
    }, { timeout: 500 });
  });

  it('should have monospace font class', () => {
    const { container } = render(<Editor />);
    const textarea = container.querySelector('.editor-textarea');

    expect(textarea).toHaveClass('editor-textarea');
  });

  it('should sync line numbers scroll with editor scroll', () => {
    const { container } = render(<Editor />);
    const textarea = container.querySelector('.editor-textarea') as HTMLTextAreaElement;
    const lineNumbersWrapper = container.querySelector('.line-numbers-wrapper') as HTMLDivElement;

    // 긴 텍스트 입력 (스크롤 가능하도록)
    const longText = Array.from({ length: 50 }, (_, i) => `Line ${i + 1}`).join('\n');
    fireEvent.change(textarea, { target: { value: longText } });

    // textarea 스크롤
    Object.defineProperty(textarea, 'scrollTop', { value: 100, writable: true });
    fireEvent.scroll(textarea);

    // line numbers wrapper도 같은 위치로 스크롤되어야 함
    expect(lineNumbersWrapper.scrollTop).toBe(100);
  });
});

