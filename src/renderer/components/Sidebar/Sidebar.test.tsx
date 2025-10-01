import { render, screen, fireEvent } from '@/__tests__/test-utils';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('should render without crashing', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('should display sidebar header', () => {
    render(<Sidebar />);
    expect(screen.getByRole('heading', { name: /최근 문서/i })).toBeInTheDocument();
  });

  it('should have toggle button', () => {
    render(<Sidebar />);
    const toggleButton = screen.getByTitle('접기/펼치기');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should have refresh button', () => {
    render(<Sidebar />);
    const refreshButton = screen.getByTitle('새로고침');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should have delete button', () => {
    render(<Sidebar />);
    const deleteButton = screen.getByTitle('삭제');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should toggle sidebar when clicking toggle button', () => {
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    const toggleButton = screen.getByTitle('접기/펼치기');
    
    // 초기 상태 확인
    expect(sidebar).not.toHaveClass('collapsed');
    
    // 토글 클릭
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('collapsed');
    
    // 다시 토글
    fireEvent.click(toggleButton);
    expect(sidebar).not.toHaveClass('collapsed');
  });

  it('should display file list area', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('file-list')).toBeInTheDocument();
  });
});

