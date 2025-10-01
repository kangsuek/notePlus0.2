import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import MainLayout from './MainLayout';

describe('MainLayout', () => {
  it('should render without crashing', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('should render three main sections', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('editor-section')).toBeInTheDocument();
    expect(screen.getByTestId('preview-section')).toBeInTheDocument();
  });

  it('should render StatusBar', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    render(<MainLayout />);
    const layout = screen.getByTestId('main-layout');
    expect(layout).toHaveClass('main-layout');
  });

  it('should display default cursor position in StatusBar', () => {
    render(<MainLayout />);
    expect(screen.getByText(/줄 1, 칸 1/)).toBeInTheDocument();
  });

  it('should update StatusBar cursor position when editor cursor moves', () => {
    render(<MainLayout />);

    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');

    // 텍스트 입력
    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2' } });

    // 커서를 두 번째 줄로 이동
    const textareaElement = textarea as HTMLTextAreaElement;
    textareaElement.setSelectionRange(7, 7); // "Line 1\n" 다음 위치
    fireEvent.click(textarea);

    // StatusBar에 줄 2가 표시되어야 함
    expect(screen.getByText(/줄 2/)).toBeInTheDocument();
  });

  it('should not show status by default', () => {
    render(<MainLayout />);
    expect(screen.queryByText('저장됨')).not.toBeInTheDocument();
    expect(screen.queryByText('수정됨')).not.toBeInTheDocument();
  });

  it('should show "수정됨" status when text changes', async () => {
    render(<MainLayout />);

    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    // debounce 시간 대기
    await waitFor(() => {
      expect(screen.getByText('수정됨')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should show "수정됨" status when filename changes', () => {
    render(<MainLayout />);

    // 파일명 클릭하여 편집 모드 진입
    const filename = screen.getByText('untitled.md');
    fireEvent.click(filename);

    // 파일명 변경
    const input = screen.getByDisplayValue('untitled.md');
    fireEvent.change(input, { target: { value: 'test.md' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('수정됨')).toBeInTheDocument();
  });

  it('should show asterisk in filename when modified', async () => {
    render(<MainLayout />);

    const textarea = screen.getByPlaceholderText('마크다운으로 작성하세요...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    // debounce 시간 대기
    await waitFor(() => {
      expect(screen.getByText('untitled.md *')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

