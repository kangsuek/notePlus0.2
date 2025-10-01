import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>notePlus</h1>
        <p>마크다운 메모 + 계산기 macOS 앱</p>
      </header>
      <main className="app-main">
        <div className="welcome-message">
          <h2>환영합니다! 🎉</h2>
          <p>notePlus 개발 환경이 성공적으로 설정되었습니다.</p>
          <ul>
            <li>✅ Electron + React + TypeScript</li>
            <li>✅ Vite 빌드 시스템</li>
            <li>✅ ESLint + Prettier</li>
            <li>✅ Jest 테스트 환경</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;

