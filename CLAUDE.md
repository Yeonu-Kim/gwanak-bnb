# 프로젝트 컨벤션 가이드

## 기술 스택

| 카테고리 | 라이브러리 |
|---|---|
| 프레임워크 | React, TypeScript, Vite |
| 라우팅 | React Router |
| 서버 상태 | TanStack React Query |
| 스타일링 | TailwindCSS, shadcn/ui |
| 컴포넌트 변형 | class-variance-authority (cva) |
| 클래스 유틸 | clsx + tailwind-merge (`cn()`) |
| 아이콘 | Lucide React |

---

## 아키텍처

### 레이어 구조

피처별로 `feature/{name}/` 디렉토리를 만들고 아래 레이어를 분리한다:

- `domain/{name}.ts` — 타입/인터페이스만 정의 (implXxx 없음)
- `service/{name}Service.ts` — 도메인 인터페이스의 구현체 (비즈니스 로직)
- `presentation/{name}Presenter.ts` — 폼 상태·입력 변환 등 UI 표현 로직
- `ui/` — 해당 피처에서만 쓰는 컴포넌트

### 의존성 주입

- 모든 서비스는 `implXxxService({ apis }): XxxService` 시그니처로 만든다
- `App.tsx`에서 `implXxxService()`를 호출해 인스턴스를 만들고 Context로 내려준다
- Context는 `ServiceContext`, `TokenContext`, `UserContext`로 분리한다
- 컴포넌트에서 서비스가 필요하면 `useGuardContext(ServiceContext)`를 사용한다

### API 호출 패턴

서비스 메서드는 항상 `ServiceResponse<T>` 를 반환한다:

- 성공: `{ type: 'success', data }`
- 실패: `{ type: 'error', code, message }`
- try/catch는 UNKNOWN_ERROR 처리 목적으로만 사용
- 상태 코드 분기는 `if (status === 200)` 패턴으로 처리

### 폴더 구조

```
src/
├── api/                  # API 클라이언트 + 엔드포인트 정의
│   ├── apis/local-server/ # 로컬 서버 엔드포인트
│   ├── apis/external-server/ # 외부 서버(S3 등) 엔드포인트
│   └── client.ts         # implApi / implExternalApi
├── components/           # 피처에 독립적인 공통 UI 컴포넌트
│   └── ui/               # shadcn 기반 Radix UI 래퍼
├── entities/             # 도메인 타입 정의 (전역 공유)
├── feature/{name}/       # 피처별 서비스 (domain + impl)
├── pages/                # 라우트별 페이지 컴포넌트
├── shared/               # context, auth, route 등 공통 모듈
├── lib/utils.ts          # cn() 등 범용 유틸
└── util/                 # 날짜·포맷 등 기타 유틸
```

---

## 라우팅 규칙

라우팅 관련 라이브러리(`useNavigate`, `Link` 등)를 컴포넌트에서 **직접 사용 금지**.
반드시 `useRouteNavigation` 훅을 통해서만 네비게이션한다.

- 경로 상수: `PATH` (정적 경로) / `routeFormatPresentation.formatRoutes()` (동적 경로)
- 모든 이동은 `useRouteNavigation`이 반환하는 메서드만 사용 (`toMain`, `toPost` 등)
- 새 경로 추가 시: `PATH` 상수 → `formatRoutes` → `useRouteNavigation` 메서드 순서로 추가
- 경로 파라미터/쿼리 읽기: `useRouteParams` 훅 사용

---

## API 규칙

### 레이어 구조

```
externalCall (fetch 래퍼, App.tsx 정의)
  → implApi / implExternalApi (헤더·토큰 주입, internalCall 생성)
    → getLocalServerApis / getExternalServerApis (엔드포인트 객체)
      → implXxxService (비즈니스 로직)
```

### 엔드포인트 정의

**로컬 서버** (`getLocalServerApis`)

- 키: `'METHOD /path'` 형태 (예: `'GET /post'`, `'POST /auth/user'`)
- 토큰 여부에 따라 `callWithToken` / `callWithoutToken` / `callWithOptionalToken` 선택
- 타입: `Apis = ReturnType<typeof getLocalServerApis>`

**외부 서버** (`getExternalServerApis`)

- 키: `'METHOD action-name'` 형태 (경로가 동적이므로 path를 인자로 받음)
- `callWithFile` 사용, 파일 다운로드 시 `returnFile: true` 전달
- 타입: `ExternalApis = ReturnType<typeof getExternalServerApis>`

### 서비스에서 API 사용

- 서비스는 `Apis` / `ExternalApis` 타입을 주입받아 `apis['METHOD /path']({ ... })` 형태로 호출
- 응답은 항상 `{ type: 'success', data } | { type: 'error', code, message }` 로 변환해서 반환

---

## TypeScript 규칙

- `strict` 모드 활성화, `any` 타입 사용 금지
- `noUncheckedIndexedAccess` 활성화 — 배열/맵 접근 시 undefined 체크 필요
- `noUnusedLocals` / `noUnusedParameters` 활성화 — 미사용 변수 금지
- 타입은 `type` 키워드로 정의 (interface 대신 type alias 선호)
- DTO 타입은 `LocalServerDTO` 네임스페이스 아래에 정의

---

## 폴더 및 파일 네이밍 규칙

- 모든 폴더와 파일은 'xxx-xxx' 꼴로 작성.
- App.tsx 제외 대문자 사용 금지


## 코딩 컨벤션

- named export만 사용. default export 사용하지 않음.
- import 시 절대경로 사용 ('@'), 상대경로 사용하지 않음.

### 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트/타입 | PascalCase | `PostCard`, `PostService` |
| 함수/변수/훅 | camelCase | `implPostService`, `useRouteNavigation` |
| 상수 | UPPER_SNAKE_CASE | `PATH`, `JOB_CATEGORY_MAP` |

타입 네이밍에서 IType 등 헝가리안 네이밍 금지


## 컴포넌트 작성 규칙

- React 함수형 컴포넌트 + 훅만 사용 (클래스 컴포넌트 금지)
- 페이지 컴포넌트는 `src/pages/`에, 재사용 컴포넌트는 `src/components/` 또는 `feature/{name}/ui/`에 배치
- props 타입은 컴포넌트 파일 내에서 `type Props = { ... }`로 정의
- 비동기 데이터 패칭은 TanStack Query의 `useQuery` / `useMutation` 사용
- 뮤테이션 후 UI 업데이트는 `queryClient.invalidateQueries` 또는 낙관적 업데이트 패턴 사용

---

## 스타일링 규칙

- **CSS 파일 작성 금지** — TailwindCSS 유틸리티 클래스만 사용
- 조건부 클래스 조합: `cn()` 함수 사용 (`clsx` + `tailwind-merge` 래퍼)
  ```ts
  import { cn } from '@/lib/utils';
  <div className={cn('base-class', isActive && 'active-class')} />
  ```
- 컴포넌트 변형(variant)이 여러 개일 때: `cva` 사용
- Radix UI 기반 복잡한 컴포넌트는 `src/components/ui/`에 shadcn 스타일로 추가
- 커스텀 색상·폰트·브레이크포인트는 `tailwind.config.js`에 정의된 토큰만 사용

### 반응형 브레이크포인트

| 토큰 | 값 |
|---|---|
| `xs` | 580px |
| `sm` | 760px |
| `md` | 984px |
| `lg` | 1344px |

# Airbnb Clone

Airbnb 메인 페이지 프론트엔드 클론. MSW로 목 API를 구성하며 백엔드 없이 동작한다.


## Key Features

- **헤더 카테고리 탭**: 숙소/체험/서비스 아이콘은 `<video>` 태그. NEW 배지 영역 포함 전체가 video.
- **검색 필터**: 필드 클릭 시 옆으로 슬라이딩 전환. 하단 상세 필터도 슬라이드 다운. 닫히지 않고 전환됨.
- **모달/드롭다운**: 헤더 탭 클릭 시 하단 슬라이드 모달. 팝업 방식(사라졌다 나타남) 사용 금지.
- **숙소 카드 피드**: 지역별 섹션 + 가로 스크롤 캐러셀. 찜 토글, 게스트 선호 배지.

## Mock API Endpoints

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/accomodations | 숙소 목록 (지역·날짜·인원 필터) |
| GET | /api/accomodations/:id | 숙소 상세 |
| POST | /api/accomodations/:id/wishlist | 찜 토글 |
| GET | /api/search/suggestions | 여행지 자동완성 |

