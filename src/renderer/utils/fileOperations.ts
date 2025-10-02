/**
 * 파일 작업 유틸리티
 * Electron IPC를 통한 파일 저장/열기
 */

interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

interface ReadFileResult {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * 파일 저장 다이얼로그 표시
 * @returns 선택된 파일 경로 또는 null (취소 시)
 */
export async function showSaveDialog(): Promise<string | null> {
  if (!window.electronAPI) {
    console.error('electronAPI is not available');
    return null;
  }

  try {
    const result = await window.electronAPI.invoke('dialog:saveFile');

    if (typeof result === 'object' && result !== null && 'canceled' in result) {
      const dialogResult = result as { canceled: boolean; filePath?: string };

      if (dialogResult.canceled) {
        return null;
      }

      return dialogResult.filePath || null;
    }

    return null;
  } catch (error) {
    console.error('Failed to show save dialog:', error);
    return null;
  }
}

/**
 * 파일 열기 다이얼로그 표시
 * @returns 선택된 파일 경로 또는 null (취소 시)
 */
export async function showOpenDialog(): Promise<string | null> {
  if (!window.electronAPI) {
    console.error('electronAPI is not available');
    return null;
  }

  try {
    const result = await window.electronAPI.invoke('dialog:openFile');

    if (typeof result === 'object' && result !== null && 'canceled' in result) {
      const dialogResult = result as { canceled: boolean; filePaths?: string[] };

      if (dialogResult.canceled || !dialogResult.filePaths || dialogResult.filePaths.length === 0) {
        return null;
      }

      return dialogResult.filePaths[0] || null;
    }

    return null;
  } catch (error) {
    console.error('Failed to show open dialog:', error);
    return null;
  }
}

/**
 * 파일에 내용 저장
 * @param filePath 파일 경로
 * @param content 저장할 내용
 * @returns 성공 여부 및 에러 메시지
 */
export async function saveFile(filePath: string, content: string): Promise<SaveFileResult> {
  if (!window.electronAPI) {
    return {
      success: false,
      error: 'electronAPI is not available',
    };
  }

  try {
    const result = await window.electronAPI.invoke('file:write', filePath, content);

    if (typeof result === 'object' && result !== null && 'success' in result) {
      const writeResult = result as { success: boolean; error?: string };

      if (writeResult.success) {
        return {
          success: true,
          filePath,
        };
      }

      return {
        success: false,
        error: writeResult.error || 'Unknown error',
      };
    }

    return {
      success: false,
      error: 'Invalid response from main process',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일에서 내용 읽기
 * @param filePath 파일 경로
 * @returns 파일 내용 또는 에러
 */
export async function readFile(filePath: string): Promise<ReadFileResult> {
  if (!window.electronAPI) {
    return {
      success: false,
      error: 'electronAPI is not available',
    };
  }

  try {
    const result = await window.electronAPI.invoke('file:read', filePath);

    if (typeof result === 'object' && result !== null && 'success' in result) {
      const readResult = result as { success: boolean; content?: string; error?: string };

      if (readResult.success && readResult.content !== undefined) {
        return {
          success: true,
          content: readResult.content,
        };
      }

      return {
        success: false,
        error: readResult.error || 'Unknown error',
      };
    }

    return {
      success: false,
      error: 'Invalid response from main process',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 파일 저장 (다이얼로그 + 저장)
 * @param content 저장할 내용
 * @returns 성공 여부 및 파일 경로
 */
export async function saveFileAs(content: string): Promise<SaveFileResult> {
  const filePath = await showSaveDialog();

  if (!filePath) {
    return {
      success: false,
      error: 'User canceled',
    };
  }

  return await saveFile(filePath, content);
}

/**
 * 파일 열기 (다이얼로그 + 읽기)
 * @returns 파일 내용 및 경로
 */
export async function openFile(): Promise<ReadFileResult & { filePath?: string }> {
  const filePath = await showOpenDialog();

  if (!filePath) {
    return {
      success: false,
      error: 'User canceled',
    };
  }

  const result = await readFile(filePath);

  return {
    ...result,
    filePath: result.success ? filePath : undefined,
  };
}
