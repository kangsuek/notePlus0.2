import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ERROR_MESSAGES } from '@renderer/constants';
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
          'input', // task list를 위한 checkbox
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'id',
          'target', 'rel', 'align', 'valign',
          'type', 'checked', 'disabled', // checkbox 속성
        ],
      });

      return sanitizedHtml;
    } catch (error) {
      // 개발 환경에서만 에러 로깅
      if (process.env.NODE_ENV === 'development') {
        console.error('Markdown parsing error:', error);
      }
      return `<p>${ERROR_MESSAGES.MARKDOWN_PARSE_ERROR}</p>`;
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

