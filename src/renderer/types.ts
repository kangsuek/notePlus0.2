/**
 * 공통 타입 정의
 * 애플리케이션 전역에서 사용하는 TypeScript 타입
 */

/**
 * 커서 위치 정보
 */
export interface CursorPosition {
  line: number;
  column: number;
}

/**
 * 파일 정보
 */
export interface FileInfo {
  name: string;
  path: string;
  lastModified: Date;
  size: number;
}

/**
 * 테마 타입
 */
export type Theme = 'light' | 'dark';

/**
 * 에디터 Props
 */
export interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onCursorChange?: (position: CursorPosition) => void;
  debounceMs?: number;
}

/**
 * StatusBar Props
 */
export interface StatusBarProps {
  cursorPosition?: CursorPosition;
  encoding?: string;
  isDirty?: boolean;
  showStatus?: boolean;
}

/**
 * Sidebar Props
 */
export interface SidebarProps {
  currentFileName?: string;
  onFileNameChange?: (newFileName: string) => void;
  isDirty?: boolean;
}

/**
 * 최근 문서 항목
 */
export interface RecentDocument {
  id: string;
  fileName: string;
  filePath: string;
  lastOpened: Date;
}

/**
 * 에러 정보
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  timestamp: Date;
}

/**
 * 마크다운 프리뷰 Props
 */
export interface MarkdownPreviewProps {
  markdown: string;
}

/**
 * LineNumbers Props
 */
export interface LineNumbersProps {
  lineCount: number;
  currentLine?: number;
}

/**
 * 키보드 단축키 정보
 */
export interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/**
 * 앱 설정
 */
export interface AppSettings {
  theme: Theme;
  fontSize: number;
  tabSize: number;
  autoSave: boolean;
  wordWrap: boolean;
}

/**
 * IPC 채널 타입
 */
export type IPCChannel = 
  | 'file:open'
  | 'file:save'
  | 'file:save-as'
  | 'file:new'
  | 'app:get-version'
  | 'window:close'
  | 'window:minimize'
  | 'window:maximize';

