# oasis-doc-convert

쉼터 인트라넷(OASIS) 자료실 전용 **문서변환 서비스**.
HWP·HWPX·HWPML·DOCX·XLSX 등을 [Kordoc](https://github.com/chrisryugj/kordoc)으로 **마크다운(MD)** 으로 변환해 돌려줍니다.

인트라넷(Google Apps Script)이 자료를 올릴 때, HWP 파일이면 이 서비스를 자동으로 호출합니다.
(PDF·이미지·워드는 인트라넷이 구글 변환으로 처리하므로, 이 서비스는 주로 **HWP 담당**입니다.)

---

## 무엇을 하나

- `GET /api/convert` — 동작 확인용(문서 변환 안 함). `{ ok, ready }` 반환.
- `POST /api/convert` — 파일을 받아 마크다운 반환.
  - 헤더: `x-oasis-secret: <비밀키>`
  - 본문(JSON): `{ "base64": "<파일 base64>", "filename": "예규.hwp" }`
  - 응답: `{ "ok": true, "markdown": "...", "meta": {...} }`

비밀키가 없거나 틀리면 `401 unauthorized`.

---

## 배포 방법 (처음 한 번)

### 1) 깃허브 저장소 만들기
- 이 폴더(`oasis-doc-convert`)를 새 깃허브 저장소로 올립니다. (조직 `shimteo-oasis`에 두면 승계에 좋음)
- 터미널에서:
  ```bash
  cd C:\Projects\oasis-doc-convert
  git init
  git add .
  git commit -m "oasis-doc-convert 초기 버전"
  git branch -M main
  git remote add origin <새-저장소-URL>
  git push -u origin main
  ```

### 2) Vercel에 연결
- Vercel → **Add New… → Project** → 방금 만든 저장소 선택 → **Import**
- Framework Preset은 자동으로 **Next.js** 로 잡힙니다. 그대로 **Deploy**.

### 3) 환경변수(비밀키) 설정
- Vercel 프로젝트 → **Settings → Environment Variables**
- `CONVERT_SECRET` 추가. 값은 **길고 무작위한 문자열**(40자 이상 권장).
- 저장 후 **Deployments → 최신 배포 → Redeploy** (환경변수는 재배포해야 반영됨).

### 4) 인트라넷(GAS)에 주소·비밀키 입력
- 배포 주소 확인: `https://oasis-doc-convert.vercel.app` 같은 형태.
- 인트라넷 관리자 **편집 설정**에서:
  - **문서변환 주소(HWP)** = `https://<배포주소>/api/convert`
  - **문서변환 비밀키** = 위 `CONVERT_SECRET`과 **똑같이**
- 저장 → 인트라넷 새 버전 배포.

### 확인
- 브라우저로 `https://<배포주소>/api/convert` 열기 → `{"ok":true,"ready":true}` 나오면 정상.
- 인트라넷 자료실에서 HWP 파일을 올려 "📖 문서 보기"가 뜨는지 확인.

---

## 로컬에서 테스트(선택)

```bash
npm install
# .env.local 파일에 CONVERT_SECRET=... 넣기
npm run dev
# http://localhost:3000/api/convert 접속 → {"ok":true,...}
```

---

## 주의

- **거주인 개인정보가 담긴 문서는 이 서비스로 보내지 마세요.** 공개 지침·예규·법령 등만 변환하세요.
- Vercel 무료 요금제는 요청 본문이 약 **4.5MB**로 제한됩니다. 아주 큰 파일은 변환되지 않을 수 있어요.
- 배포용(DRM)으로 잠긴 HWP는 변환이 안 될 수 있습니다(원본은 그대로 보관됨).

## 라이선스/의존성

- [kordoc](https://github.com/chrisryugj/kordoc) (MIT) — 문서 파싱·마크다운 변환
