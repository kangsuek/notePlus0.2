import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
  markdown: string;
}

/**
 * 마크다운을 HTML로 렌더링하는 컴포넌트
 * - marked 라이브러리로 마크다운 파싱
 * - DOMPurify로 XSS 공격 방지
 * - useMemo로 성능 최적화
 */
const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  // marked 옵션 설정 (한 번만 실행)
  useMemo(() => {
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown 지원
      breaks: true, // 줄바꿈을 <br>로 변환
    });
  }, []);

  // 마크다운을 HTML로 변환 (메모이제이션)
  const htmlContent = useMemo(() => {
    if (!markdown || markdown.trim() === '') {
      return '';
    }

    try {
      // 1. 마크다운을 HTML로 변환
      const rawHtml = marked.parse(markdown, { async: false }) as string;
      
      // 2. DOMPurify로 위험한 HTML 제거 (XSS 방지)
      const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'hr',
          'strong', 'em', 'del', 's', 'ins', 'u',
          'a', 'img',
          'ul', 'ol', 'li',
          'blockquote', 'pre', 'code',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'div', 'span',
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'id',
          'target', 'rel', 'align', 'valign',
        ],
      });

      return sanitizedHtml;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p>마크다운을 렌더링하는 중 오류가 발생했습니다.</p>';
    }
  }, [markdown]);

  return (
    <div
      className="markdown-preview"
      data-testid="markdown-preview"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default React.memo(MarkdownPreview);

