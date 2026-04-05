# plab VOC AI 분석

플래버의 의견이 궁금해 — 내부 VOC 의미 기반 검색 도구  
Google OAuth 로그인 + 비공개 시트 연동 버전

## 파일 구조
```
voc-search/
├── public/index.html   ← 전체 UI (로그인 화면 포함)
├── api/analyze.js      ← Anthropic AI 분석 프록시
├── api/sheets.js       ← Google Sheets 비공개 읽기 프록시
├── vercel.json         ← 라우팅 설정
└── README.md
```

---

## 배포 전 설정 (순서대로)

### ① Firebase 프로젝트 (구글 로그인용)
1. console.firebase.google.com → 프로젝트 생성
2. Authentication → Google 로그인 활성화
3. 프로젝트 설정 → 웹 앱 추가 → firebaseConfig 복사
4. public/index.html 상단 FIREBASE_CONFIG 에 붙여넣기
5. 배포 후 Vercel URL을 Firebase 승인된 도메인에 추가

### ② Google Cloud 서비스 계정 (비공개 시트 읽기용)
1. console.cloud.google.com → 기존 Firebase 프로젝트 선택
2. IAM 및 관리자 → 서비스 계정 → 서비스 계정 만들기
3. 키 만들기 → JSON 다운로드
4. Google Sheets API 활성화 (APIs & Services → Library → Google Sheets API)
5. 구글 시트 → 공유 → 서비스 계정 이메일 추가 (뷰어 권한)
   예) abc123@your-project.iam.gserviceaccount.com

### ③ Vercel 환경변수 (대시보드 → Settings → Environment Variables)

| Key                | Value                                      |
|--------------------|--------------------------------------------|
| ANTHROPIC_API_KEY  | sk-ant-...                                 |
| SHEET_ID           | 시트 URL의 /d/【이부분】/edit               |
| SHEET_NAME         | Sheet1 (실제 탭 이름)                      |
| GCP_SA_EMAIL       | abc123@your-project.iam.gserviceaccount.com|
| GCP_SA_KEY         | JSON 파일 안의 private_key 값 전체          |

> GCP_SA_KEY 입력 시: JSON 파일 열어서 "private_key" 값을 통째로 복사
> -----BEGIN PRIVATE KEY----- 부터 -----END PRIVATE KEY----- 까지 전부

### ④ Vercel 배포
```bash
npm i -g vercel
cd voc-search
vercel
```
환경변수 추가 후 Redeploy 1회 실행.
