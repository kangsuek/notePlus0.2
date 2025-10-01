import { render, screen } from '@/__tests__/test-utils';
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
});

