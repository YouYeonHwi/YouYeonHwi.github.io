# Whistle's Dev Diary — 개발 가이드 (CLAUDE.md)

이 프로젝트는 **Jekyll 기반의 개발 블로그(Whistle's Dev Diary)**와 **Firebase Realtime Database를 활용한 모바일 2인용 게임 광장(커플 게임 광장)**으로 구성된 통합 웹 어플리케이션입니다.

---

## 1. 빌드 및 실행 명령어 (Build & Run Commands)

### 1.1. 블로그 로컬 서버 (Jekyll)
블로그의 마크다운 글과 전체 레이아웃을 로컬에서 확인하고 실시간 반영(Live Reload)을 지원합니다.
* **의존성 설치**: `bundle install`
* **로컬 서버 실행 (일반)**:
  ```bash
  bundle exec jekyll serve --host 127.0.0.1 --trace --livereload
  ```
* **간편 실행 스크립트 (Windows)**:
  * 프로젝트 루트의 `local_server_start.bat` 파일을 더블 클릭하여 실행할 수 있습니다.
  * 접속 주소: `http://localhost:4000` (Jekyll 기본 포트)

### 1.2. 게임 로컬 서버 (Node.js 간이 서버)
Jekyll 빌드를 거치지 않고 `games/` 폴더 내의 정적 파일(HTML, CSS, JS)과 Firebase 실시간 연동을 신속히 개발할 때 사용합니다.
* **의존성 설치**: `npm install`
* **로컬 서버 실행**:
  ```bash
  npm run dev
  ```
  *(내부적으로 `node server.js`가 구동되며 MIME 타입 매핑 및 404 폴백을 지원합니다)*
* **접속 주소**: `http://localhost:3000` (게임 광장 바로가기: `http://localhost:3000/games/`)

### 1.3. 테스트 실행 (Jest)
자바스크립트 브라우저 바인딩 코드의 유닛 테스트를 수행합니다.
* **테스트 실행**:
  ```bash
  npm test
  ```
  *(JSDOM을 환경으로 하여 `tests/` 폴더 내의 테스트 스위트를 수행합니다)*

---

## 2. 프로젝트 구조 (Project Structure)

```text
YouYeonHwi.github.io/
├── _config.yml             # Jekyll 설정 파일 (gitbook 테마 및 컬렉션 설정)
├── Gemfile                 # Ruby 의존성 설정 (Jekyll 및 플러그인)
├── package.json            # Node.js 패키지 및 개발 의존성 (Jest, JSDOM)
├── server.js               # Node.js 기반 정적 게임 로컬 서버
├── local_server_start.bat  # Jekyll 서버 일괄 실행 배치 파일
│
├── _pages/                 # 블로그 콘텐츠 (Jekyll 컬렉션)
│   ├── 파이썬 기초문법/       # Python 강좌 마크다운 파일들
│   └── C언어 기초문법/        # C언어 강좌 마크다운 파일들
│
├── _includes/              # Jekyll 템플릿 포함 파일 (head, footer, toc 등)
├── _layouts/               # Jekyll 레이아웃 파일 (page, post, default)
│
├── assets/                 # 블로그 정적 자원 (CSS, JS, 이미지)
│   └── gitbook/custom.js   # 블로그 커스텀 프론트엔드 스크립트 (각주 이동 등)
│
├── games/                  # 2인용 모바일 게임 광장
│   ├── index.html          # 게임 광장 메인 로비 UI
│   ├── common.js           # 2인용 게임 공통 엔진 (Firebase 연동, 테마, 진동, 점수 등)
│   ├── firebase-config.js  # Firebase 클라이언트 SDK 구성 정보
│   ├── template.html       # 게임 제작용 기본 HTML 템플릿
│   ├── assets/             # 공통 시바 마스코트 이미지 등 에셋
│   └── [game-name]/        # 각 개별 게임 폴더 (예: yahtzee, omok, tetris 등)
│
└── tests/                  # 테스트 스위트
    └── custom.test.js      # 프론트엔드 인터랙션 단위 테스트
```

---

## 3. 개발 및 코딩 규칙 (Coding Guidelines)

### 3.1. 블로그 콘텐츠 작성 규칙
* **Front Matter**: 신규 마크다운 페이지 추가 시 상단에 레이아웃 형식을 필수로 선언해야 합니다.
  ```markdown
  ---
  layout: post     # 혹은 page
  title: "글 제목"
  ---
  ```
* **언어 및 경로**:
  * 파이썬 페이지는 영어 슬러그 파일명(예: `class.md`, `loops.md`)을 유지합니다.
  * C언어 페이지는 한글 슬러그 파일명(예: `포인터.md`, `구조체.md`)을 주로 사용합니다.

### 3.2. 게임 광장 (Games) 개발 규칙
* **모바일 반응형 및 방지**:
  * 모바일 한 화면에서 2인이 조작하는 환경이므로 더블탭 줌, 핀치 줌, 우클릭 롱프레스 메뉴를 원천 차단합니다.
  * 게임 초기화 시 반드시 `GameUtils.init()`을 호출하여 뷰포트 락 및 테마/마스코트 인젝션을 진행해야 합니다.
* **공통 테마 (CSS Variables) 활용**:
  * 하드코딩된 색상 대신 CSS 변수(`--primary`, `--accent`, `--bg`, `--surface-hover` 등)를 사용하여 시바(Shiba Pink), 사이버(Cyber Dark) 등 테마 스위칭에 대응하도록 작성합니다.
* **Firebase 실시간 원격 싱크 (RemoteManager)**:
  * 원격 대결 모드를 지원하기 위해 `GameUtils.RemoteManager` 모듈을 제공합니다.
  * **방 생성/로비 구동**: `GameUtils.RemoteManager.openLobby(gameId, initialState, onStartCallback)`을 호출하여 공통 방 만들기/참여 모달을 띄우고 상태 변화를 모니터링합니다.
  * **상태 업데이트**: 게임 진행 데이터를 동기화할 때 `updateState(state)` 혹은 특정 키만 타겟하는 `updateField(subPath, value)`를 사용합니다.
  * **퇴장 처리**: 게임 오버 또는 이탈 시 `leaveRoom()`을 호출하여 Firebase의 룸 리소스를 정리하고 메모리 누수를 방지합니다.
* **로컬 스코어 저장**:
  * LocalStorage에 누적 점수를 기록할 때는 `GameUtils.getScores(gameId)` 및 `GameUtils.saveScores(gameId, scores)` 유틸 함수를 사용합니다.

### 3.3. 자바스크립트 테스트 규칙 (Jest)
* DOM 조작이나 jQuery 바인딩을 포함하는 스크립트를 테스트할 때는 `jsdom` 환경을 선언하고 전역 `window`, `document`, `$` 객체를 모킹하여 테스트 케이스를 통과시킵니다.
  ```javascript
  /** @jest-environment node */
  const { JSDOM } = require('jsdom');
  // ... 글로벌 모킹 후 테스트 대상 함수 실행
  ```
