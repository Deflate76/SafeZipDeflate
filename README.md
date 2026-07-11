# NPNCB Vulnerability Lab — Integrated GitHub Pages Site

`safe.zipdeflate.com`의 **개요 → 왜 중요한가 → 핵심 개념** 정보 구조와, 기존 **NPNCB / DBA Lab**의 상세 DBA 구조·삽입/복원 흐름·적응형 C# PoC·탐지/대응 콘텐츠를 하나의 다크 테마 정적 사이트로 통합한 버전입니다.

> 원 사이트의 문장을 그대로 복제하지 않고, 동일한 정보 구조와 사실 관계를 바탕으로 한·영 문장을 새로 작성했습니다. 원 사이트는 참고 자료에 명시되어 있습니다.

## 구성

- 기본 다크 테마, 선택적 라이트 전환
- 가독성 중심 타이포그래피: 본문 약 16–17px, 보조 라벨 최소 약 12.5–13px, 강화된 명암 대비
- 한국어 / 영어 즉시 전환
- 논문 메타데이터와 핵심 개요
- 왜 중요한가: 콘텐츠 무결성과 raw 압축 스트림 무결성의 차이
- Deflate 블록, DBA, NPNCB 핵심 개념
- NPNCB 비트 구조와 DBA 용량 계산기
- 메시지 삽입 / 복원 파이프라인
- Stored / Fixed / Dynamic 실제 비트 비용 비교형 C# PoC
- 삽입기, 복원기, 전체 Visual Studio 솔루션 다운로드
- 비트 단위 탐지, 다중 신호 판정, 재압축 정규화
- FAQ, RFC 1951, PKWARE, zlib, 원 논문, 기존 소개 사이트 참고 링크

## 로컬 미리보기

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080/`을 엽니다.

## GitHub Pages 배포

1. 이 폴더의 모든 파일을 저장소 루트에 올립니다.
2. **Settings → Pages → Source**에서 **GitHub Actions**를 선택합니다.
3. `main` 브랜치에 push합니다.
4. 포함된 `.github/workflows/pages.yml`이 정적 사이트를 배포합니다.

빌드 도구, 외부 CDN, 분석 스크립트는 필요하지 않습니다.

## 주요 파일

```text
index.html          통합 한·영 본문
assets/styles.css   다크 중심 디자인, 가독성 타이포그래피, 반응형 레이아웃
assets/app.js       언어, 테마, 모바일 메뉴, DBA 계산기
downloads/          C# PoC 프로젝트 ZIP과 SHA-256
```

## 콘텐츠 출처와 재작성 원칙

- 초반 세 장의 정보 구조 참고: https://safe.zipdeflate.com/
- 표준 동작: RFC 1951
- NPNCB / DBA 용어와 연구 주장: 김정훈, 정보보호학회논문지 32(5), 2022
- PoC 설명과 상세 도표: 본 프로젝트용으로 작성한 기존 DBA Lab 콘텐츠

사이트 자체 문장은 통합판을 위해 새로 작성했으며, 논문 제목·저자·DOI 같은 서지 정보와 표준 필드명은 사실 정보로 표기했습니다.

## 언어 URL

```text
./index.html?lang=ko
./index.html?lang=en
./ko.html
./en.html
```

## 라이선스

사이트 코드와 자체 작성 콘텐츠는 [MIT License](LICENSE)를 따릅니다. 링크된 표준, 논문, 기존 사이트 및 포함 PoC의 권리는 각 권리자와 개별 라이선스를 따릅니다.
