import { render, screen, fireEvent } from '@/__tests__/test-utils';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('should render without crashing', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should display moon icon and text in light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId('theme-toggle');
    expect(button.textContent).toContain('🌙');
    expect(button.textContent).toContain('라이트 모드');
  });

  it('should toggle theme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId('theme-toggle');

    // 초기 상태: light mode
    expect(button.textContent).toContain('🌙');
    expect(button.textContent).toContain('라이트 모드');

    // 클릭: dark mode로 전환
    fireEvent.click(button);
    expect(button.textContent).toContain('☀️');
    expect(button.textContent).toContain('다크 모드');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // 다시 클릭: light mode로 전환
    fireEvent.click(button);
    expect(button.textContent).toContain('🌙');
    expect(button.textContent).toContain('라이트 모드');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('should have proper title attribute', () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId('theme-toggle');
    expect(button.getAttribute('title')).toContain('라이트 모드');
  });
});

