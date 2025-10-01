# notePlus

> 마크다운 메모 + 계산기 macOS 네이티브 앱

## 📝 프로젝트 개요

notePlus는 macOS 사용자를 위한 마크다운 기반 메모 애플리케이션입니다. 실시간 프리뷰와 수식 계산 기능을 제공하여 메모 작성과 계산을 동시에 수행할 수 있습니다.

### 핵심 기능

- ✅ **마크다운 편집**: 실시간 프리뷰, 모든 마크다운 문법 지원
- ✅ **수식 계산**: `=` 입력 시 즉시 계산 결과 표시 (mathjs 사용)
- ✅ **양방향 스크롤 동기화**: Editor ↔ Preview 간 스크롤 동기화
- ✅ **파일 관리**: 로컬 파일 저장/열기, 최근 문서 관리
- ✅ **macOS 네이티브**: Dark Mode, 키보드 단축키, 메뉴바 시스템
- ✅ **다중 파일 포맷**: .md, .txt, .pdf 지원

## 🛠 기술 스택

- **플랫폼**: macOS 11.0+
- **프레임워크**: Electron + React + TypeScript
- **빌드 도구**: Vite
- **테스트**: Jest + React Testing Library
- **스타일링**: Styled Components
- **주요 라이브러리**: marked, mathjs, electron-store

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 18.0.0
- npm >= 9.0.0
- macOS 11.0+

### 설치

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 테스트 실행
npm test

# 빌드
npm run build
```

## 📚 개발 가이드

### 프로젝트 구조

```
notePlus0.2/
├── src/
│   ├── main/          # Electron 메인 프로세스
│   ├── renderer/      # React 렌더러 프로세스
│   ├── shared/        # 공유 타입 및 유틸리티
│   └── __tests__/     # 테스트 파일
├── docs/              # 문서
│   ├── 01.prd         # 제품 요구사항 명세서
│   └── 02.progress-status.md  # 개발 진행 상황
├── .cursorrules       # Cursor AI 개발 규칙
└── package.json
```

### 개발 원칙

이 프로젝트는 **TDD (Test-Driven Development)** 방법론을 따릅니다:

1. ✅ 테스트 먼저 작성
2. ✅ 테스트 실패 확인
3. ✅ 최소한의 코드로 구현
4. ✅ 테스트 통과
5. ✅ 리팩토링

자세한 개발 규칙은 [.cursorrules](./.cursorrules) 파일을 참고하세요.

## 📖 문서

- [PRD (Product Requirements Document)](./docs/01.prd)
- [개발 진행 상황](./docs/02.progress-status.md)
- [Cursor AI 개발 규칙](./.cursorrules)

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# Watch 모드
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

목표 테스트 커버리지: **70% 이상**

## 🎨 코드 품질

```bash
# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 포맷팅
npm run format

# Prettier 검사
npm run format:check
```

## 📈 개발 현황

**현재 Phase**: Phase 1 (MVP) - Week 1  
**진행률**: 프로젝트 초기 설정 진행 중

자세한 진행 상황은 [개발 진행 상황](./docs/02.progress-status.md)을 참고하세요.

## 🤝 기여하기

이 프로젝트는 TDD 방식으로 개발됩니다. 기여 시 다음 사항을 준수해주세요:

- 모든 기능에 테스트 작성
- ESLint, Prettier 규칙 준수
- TypeScript strict 모드 준수
- 보안 원칙 준수 (eval 금지, XSS 방지 등)

## 📄 라이선스

MIT License

## 👥 팀

notePlus Team

---

**개발 시작일**: 2025-10-01  
**목표 MVP 완성일**: 2025-10-31

