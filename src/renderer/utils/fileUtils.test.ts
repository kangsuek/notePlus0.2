import {
  getFileExtension,
  getFileExtensionFromName,
  isMarkdownFile,
  isTextFile,
  shouldShowPreview,
} from './fileUtils';

describe('fileUtils', () => {
  describe('getFileExtension', () => {
    it('should extract file extension with dot', () => {
      expect(getFileExtension('/path/to/file.md')).toBe('.md');
      expect(getFileExtension('/path/to/file.txt')).toBe('.txt');
      expect(getFileExtension('/path/to/file.MD')).toBe('.md'); // 소문자 변환
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('/path/to/file')).toBe('');
      expect(getFileExtension('file')).toBe('');
    });

    it('should handle multiple dots correctly', () => {
      expect(getFileExtension('/path/to/file.backup.md')).toBe('.md');
    });
  });

  describe('getFileExtensionFromName', () => {
    it('should work the same as getFileExtension', () => {
      expect(getFileExtensionFromName('file.md')).toBe('.md');
      expect(getFileExtensionFromName('file.txt')).toBe('.txt');
    });
  });

  describe('isMarkdownFile', () => {
    it('should return true for markdown files', () => {
      expect(isMarkdownFile('/path/to/file.md')).toBe(true);
      expect(isMarkdownFile('/path/to/file.markdown')).toBe(true);
      expect(isMarkdownFile('file.md')).toBe(true);
      expect(isMarkdownFile('file.MD')).toBe(true); // 대소문자 무관
    });

    it('should return false for non-markdown files', () => {
      expect(isMarkdownFile('/path/to/file.txt')).toBe(false);
      expect(isMarkdownFile('/path/to/file.js')).toBe(false);
      expect(isMarkdownFile('file')).toBe(false);
    });
  });

  describe('isTextFile', () => {
    it('should return true for text files', () => {
      expect(isTextFile('/path/to/file.txt')).toBe(true);
      expect(isTextFile('file.txt')).toBe(true);
      expect(isTextFile('file.TXT')).toBe(true); // 대소문자 무관
    });

    it('should return false for non-text files', () => {
      expect(isTextFile('/path/to/file.md')).toBe(false);
      expect(isTextFile('/path/to/file.js')).toBe(false);
      expect(isTextFile('file')).toBe(false);
    });
  });

  describe('shouldShowPreview', () => {
    it('should return true for markdown files', () => {
      expect(shouldShowPreview('/path/to/file.md')).toBe(true);
      expect(shouldShowPreview('/path/to/file.markdown')).toBe(true);
    });

    it('should return false for text files', () => {
      expect(shouldShowPreview('/path/to/file.txt')).toBe(false);
    });

    it('should return false for other files', () => {
      expect(shouldShowPreview('/path/to/file.js')).toBe(false);
      expect(shouldShowPreview('file')).toBe(false);
    });
  });
});
