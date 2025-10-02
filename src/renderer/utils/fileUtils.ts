/**
 * 파일 관련 유틸리티 함수
 */

/**
 * 파일 확장자 추출
 * @param filePath 파일 경로
 * @returns 확장자 (소문자, 점 포함)
 */
export function getFileExtension(filePath: string): string {
  const lastDotIndex = filePath.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return '';
  }
  return filePath.substring(lastDotIndex).toLowerCase();
}

/**
 * 파일명에서 확장자 추출
 * @param fileName 파일명
 * @returns 확장자 (소문자, 점 포함)
 */
export function getFileExtensionFromName(fileName: string): string {
  return getFileExtension(fileName);
}

/**
 * 마크다운 파일인지 확인
 * @param filePath 파일 경로 또는 파일명
 * @returns 마크다운 파일 여부
 */
export function isMarkdownFile(filePath: string): boolean {
  const extension = getFileExtension(filePath);
  return extension === '.md' || extension === '.markdown';
}

/**
 * 텍스트 파일인지 확인
 * @param filePath 파일 경로 또는 파일명
 * @returns 텍스트 파일 여부
 */
export function isTextFile(filePath: string): boolean {
  const extension = getFileExtension(filePath);
  return extension === '.txt';
}

/**
 * 프리뷰를 표시해야 하는 파일인지 확인
 * @param filePath 파일 경로 또는 파일명
 * @returns 프리뷰 표시 여부
 */
export function shouldShowPreview(filePath: string): boolean {
  return isMarkdownFile(filePath);
}
