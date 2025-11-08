# **FS-7 2팀 고급 프로젝트**

코드잇 FS 7기 2팀 고급 프로젝트 FE Github입니다.

BE Github : https://github.com/MovingProject/7-Moving-team2-BE

## **팀원 구성 및 역할**

김제성 : 팀 리더, 스크럼 마스터, 팀 Notion 관리, FE Github 관리

김미정 : readme 작성

이다슬 : 회의록 정리, ppt 제작

이유진 : BE Github 관리

정남영 : Github 이슈 관리

정부광 : 시연 영상 제작

---

## **프로젝트 소개**

- 소개: 이사 소비자와 이사 전문가 매칭 서비스
  > 이사 시장에서는 무분별한 가격 책정과 무책임한 서비스 등으로 인해 정보의 투명성 및 신뢰도가 낮은 문제가 존재합니다. 이러한 문제를 해결하기 위해, 소비자가 원하는 서비스와 주거 정보를 입력하면 이사 전문가들이 견적을 제공하고 사용자가 이를 바탕으로 이사 전문가를 선정할 수 있는 매칭 서비스를 제작합니다. 이를 통해 소비자는 견적과 이사 전문가의 이전 고객들로부터의 후기를 확인하며 신뢰할 수 있는 전문가를 선택할 수 있고, 소비자와 이사 전문가 간의 간편한 매칭이 가능합니다. 실시간 채팅을 추가하여 더욱 세부적인 조율이 가능합니다.

---

## **기술 스택**

- Next.js
- Typescript
- App Router
- Tailwind CSS
- Axios
- React-Query
- Zustand
- Vercel

## **팀원별 구현 기능 상세**

### 김제성

- 공통 컴포넌트
  - 필터
  - 모달
  - 팝업
- 페이지 UI/UX
  - 기사님 마이 페이지와 기본 정보 수정 페이지
  - 기사님 찾기 페이지 및 기사 상세 페이지
  - 고객 찜한 기사 페이지
- 프론트 api 연동
  - 고객 / 기사님 프로필 수정
  - 기사님 받은 요청 조회
  - 기사 및 찜한 기사 목록 조회
  - 기사 찜하기 및 취소
  - 기사 상세 페이지 조회
  - 지정 견적 요청
  - 리뷰 조회 및 등록
  - 알림
  - 구글 로그인
- QA
  - 전반적인 프론트엔드 QA 작업

- R&R
  - 팀 리더
  - 스크럼 / 브리핑 마스터
  - Github 전반적인 체크 및 관리

### 이다슬

- 공통 컴포넌트
  - 서비스 전반에 필요한 카드 **`ui 컴포넌트`**
  - 견적요청 ui에 맞는 **`말풍선 컴포넌트`**
  - 에러 메세지 출력을 위한 **`Alert 컴포넌트`**
- 견적 요청 페이지
  - 견적 요청 페이지 마크업 및 각 입력항목 단계별 컴포넌트 분리
  - **API 연동 및 데이터 전송:** 완성된 견적 요청 데이터를 백엔드 서버로 전송하기 위한 **`POST /api/requests`** 엔드포인트 연결 로직 구현
  - **상태 관리 및 데이터 지속성 확보 (Zustand/로컬 스토리지):**
    - 견적 요청 단계별 입력 데이터를 **Zustand 전역 상태 관리 라이브러리**에 저장하여 관리
    - 사용자가 페이지를 이탈하거나 새로고침해도 데이터가 유지되도록, **Zustand 스토어를 로컬 스토리지(LocalStorage)에 영구적으로 저장**하는 로직 구현 (Persistence Middleware 적용).
  - **주소 상태 관리 및 데이터 무결성 보장:**
    - 주소 데이터를 기본 주소와 상세 주소로 분리 관리하고, 최종 제출 시 **고유 구분자(`|`)**를 사용하여 안전하게 결합하는 로직 적용.
  - **사용자 경험(UX) 개선:**
    - 주소 검색 완료 후, **`useRef`와 `setTimeout`을 활용**하여 상세 주소 입력 필드에 **자동으로 포커스**가 이동하도록 구현
- 견적관리 페이지
  - **API 연동**
    - 기사가 발송한 견적 목록을 조회하는 API (`useDriverQuotationList`) 연동.
    - 고객이 받은 견적 요청 목록 API 연동. (요청 객체 내에 `quotations` 배열 포함)
  - **컴포넌트 매핑**
    - 범용 컴포넌트 재활용을 위해, 백엔드 필드명과 클라이언트 표준 불일치를 해결하는 매핑 로직 구현

### 정남영

- 프론트엔드 / QA
  - 받은 요청 검색 시 깜빡거림 현상 수정 (fix: #171)
  - 받은 요청 페이지 모바일 필터 미적용 문제 수정 (fix: #171)
  - 하단 패딩값 불일치 문제 수정 (fix: #171)
  - 채팅방 상대 프로필 이미지 표시 오류 수정 (fix: #171)

### 정부광

- 채팅 관련
  - 채팅 API 연결 및 UI/플로우 구성 (채팅 시작, 견적 송신/수락)
  - 채팅 메시지 페이지네이션 버그 수정 (최신 메시지 누락 해결)
  - chat API 소소한 보완 (consumerId 등)
- 프로필/UX
  - 기사/고객 프로필 등록·수정 API 연동 및 유효성 검사
  - 프로필 아바타 추가 및 기본 이미지 처리
  - 로그인/리다이렉트 예외 처리 개선
- 파일 처리/문서
  - 채팅 견적서 및 계약서 PDF 생성·다운로드 기능 구현
- UI/컴포넌트/반응형
  - 공통 버튼 컴포넌트 개선, 이미지 태그 정리
  - 반응형 리뷰 페이지 및 landing 반응형 개선
  - QA 대응 및 UI 버그 수정
- 기타
  - 자동 로그아웃 단시간 이슈 수정, 충돌 해결

## **폴더 구조**

```
.
├── .DS_Store
├── .eslintignore
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│ ├── .DS_Store
│ ├── favicon.ico
│ ├── icon
│ │ ├── ic-filter.svg
│ │ ├── like-off.svg
│ │ ├── like-on.svg
│ │ ├── Logo.svg
│ │ └── star.svg
│ ├── images
│ │ ├── avatars
│ │ └── empty.svg
│ └── og-image.png
├── README.md
├── src
│ ├── .DS_Store
│ ├── app
│ │ ├── auth
│ │ ├── chat
│ │ ├── driver
│ │ ├── driverList
│ │ ├── landing
│ │ ├── layout.tsx
│ │ ├── liked
│ │ ├── loading.tsx
│ │ ├── login
│ │ ├── mypage
│ │ ├── page.tsx
│ │ ├── quotation
│ │ ├── request
│ │ ├── review
│ │ ├── signUp
│ │ ├── spinnerTest
│ │ ├── test
│ │ └── user
│ ├── assets
│ │ ├── icon
│ │ ├── img
│ │ └── lottie
│ ├── components
│ │ ├── chat
│ │ ├── layout
│ │ ├── ui
│ │ └── WelcomeOverlay.tsx
│ ├── hooks
│ │ ├── useAuthForm.ts
│ │ ├── useDriverProFileForm.ts
│ │ ├── useProfileQuery.ts
│ │ └── useReceivedRequests.ts
│ ├── lib
│ │ ├── apiClient.ts
│ │ ├── apis
│ │ └── test.ts
│ ├── services
│ │ ├── quotationService.ts
│ │ └── requestService.ts
│ ├── store
│ │ ├── authStore.ts
│ │ ├── chatStore.ts
│ │ ├── filterStore.ts
│ │ ├── roleStore.ts
│ │ ├── test.ts
│ │ ├── useRequestDraftStore.ts
│ │ └── userStore.ts
│ ├── styles
│ │ └── globals.css
│ ├── types
│ │ ├── areaTypes.ts
│ │ ├── card.ts
│ │ ├── chat.ts
│ │ ├── contract.ts
│ │ ├── daum.d.ts
│ │ ├── driver.ts
│ │ ├── global.d.ts
│ │ ├── moveTypes.ts
│ │ ├── ms.d.ts
│ │ ├── quotation.ts
│ │ ├── receivedRequest.ts
│ │ ├── request.ts
│ │ ├── serverError.ts
│ │ ├── statement.ts
│ │ ├── svg.d.ts
│ │ └── tabs.ts
│ └── utils
│ ├── constant
│ ├── formatRequestData.ts
│ ├── hook
│ ├── mappers
│ ├── pdfUtils.ts
│ ├── quotationAdapter.ts
│ ├── type-guards.ts
│ └── validation.ts
├── structure.txt
└── tsconfig.json

```

## **배포 주소**

https://7-moving-team2-fe.vercel.app/

## **프로젝트 회고**

### 팀 Notion

https://www.notion.so/26210fb7efeb80278848d8dc5aed615d?v=26210fb7efeb815bb8ee000c38d6e98c&source=copy_link

### 발표 자료

https://drive.google.com/drive/folders/1wIOyfBCJHlj5GlY1ZCT5cjAy5s_9Fkt3
