import { render, screen } from '@/__tests__/test-utils';
import MarkdownPreview from './MarkdownPreview';

describe('MarkdownPreview', () => {
  it('should render without crashing', () => {
    render(<MarkdownPreview markdown="" />);
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
  });

  it('should render empty content for empty markdown', () => {
    const { container } = render(<MarkdownPreview markdown="" />);
    const preview = container.querySelector('.markdown-preview');
    expect(preview?.textContent?.trim()).toBe('');
  });

  it('should render plain text', () => {
    render(<MarkdownPreview markdown="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render heading H1', () => {
    render(<MarkdownPreview markdown="# Title" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Title');
  });

  it('should render heading H2', () => {
    render(<MarkdownPreview markdown="## Subtitle" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Subtitle');
  });

  it('should render paragraph', () => {
    render(<MarkdownPreview markdown="This is a paragraph." />);
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
  });

  it('should render bold text', () => {
    const { container } = render(<MarkdownPreview markdown="**bold text**" />);
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('bold text');
  });

  it('should render italic text', () => {
    const { container } = render(<MarkdownPreview markdown="*italic text*" />);
    const em = container.querySelector('em');
    expect(em).toBeInTheDocument();
    expect(em).toHaveTextContent('italic text');
  });

  it('should render unordered list', () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const { container } = render(<MarkdownPreview markdown={markdown} />);
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(ul?.querySelectorAll('li')).toHaveLength(3);
  });

  it('should render ordered list', () => {
    const markdown = '1. First\n2. Second\n3. Third';
    const { container } = render(<MarkdownPreview markdown={markdown} />);
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
    expect(ol?.querySelectorAll('li')).toHaveLength(3);
  });

  it('should render link', () => {
    const { container } = render(<MarkdownPreview markdown="[Click here](https://example.com)" />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Click here');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should render inline code', () => {
    const { container } = render(<MarkdownPreview markdown="`const x = 5;`" />);
    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code).toHaveTextContent('const x = 5;');
  });

  it('should render code block', () => {
    const markdown = '```javascript\nconst x = 5;\nconsole.log(x);\n```';
    const { container } = render(<MarkdownPreview markdown={markdown} />);
    const pre = container.querySelector('pre');
    const code = container.querySelector('code');
    expect(pre).toBeInTheDocument();
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toContain('const x = 5;');
  });

  it('should render blockquote', () => {
    const { container } = render(<MarkdownPreview markdown="> This is a quote" />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent('This is a quote');
  });

  it('should sanitize dangerous HTML', () => {
    const dangerousMarkdown = '<script>alert("XSS")</script>';
    const { container } = render(<MarkdownPreview markdown={dangerousMarkdown} />);
    const script = container.querySelector('script');
    // marked는 기본적으로 HTML을 이스케이프하므로 script 태그가 실제로 실행되지 않음
    expect(script).not.toBeInTheDocument();
  });

  it('should update when markdown prop changes', () => {
    const { rerender } = render(<MarkdownPreview markdown="Initial text" />);
    expect(screen.getByText('Initial text')).toBeInTheDocument();

    rerender(<MarkdownPreview markdown="Updated text" />);
    expect(screen.getByText('Updated text')).toBeInTheDocument();
    expect(screen.queryByText('Initial text')).not.toBeInTheDocument();
  });
});

