import { app, BrowserWindow } from 'electron';
import path from 'path';

// 개발 환경 확인
const isDev = process.env.NODE_ENV === 'development';

// 메인 윈도우 인스턴스
let mainWindow: BrowserWindow | null = null;

/**
 * 메인 윈도우 생성 함수
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS 네이티브 스타일
    webPreferences: {
      // 보안 설정
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Preload 스크립트
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false, // 준비될 때까지 숨김
  });

  // 윈도우 준비되면 표시
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 개발 모드에서는 Vite 개발 서버 로드
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // 개발자 도구는 필요시 Cmd+Option+I (macOS) 또는 F12로 열기
    // mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션에서는 빌드된 파일 로드
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // 윈도우가 닫힐 때
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Electron 앱 준비 완료
 */
app.whenReady().then(() => {
  createWindow();

  // macOS에서 dock 아이콘 클릭 시 윈도우 재생성
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * 모든 윈도우가 닫힐 때
 * macOS를 제외하고는 앱 종료
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * 앱 종료 전 정리 작업
 */
app.on('before-quit', () => {
  // 필요한 정리 작업 수행
});

