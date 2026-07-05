# NPNCB Vulnerability Static Page

Deflate 압축 알고리즘에서 발견된 NPNCB(No-Payload Non-Compressed Block) 및 DBA(Disposed Bit Area) 기반 은닉 취약점 논문을 소개하기 위한 GitHub Pages용 정적 페이지입니다.

## 구성

- `index.html` - 단일 소개 페이지
- `styles.css` - 반응형 스타일
- `.nojekyll` - GitHub Pages에서 Jekyll 처리를 비활성화

## GitHub Pages 배포 방법

1. 이 폴더의 파일을 GitHub 저장소 루트에 업로드합니다.
2. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Source**를 `Deploy from a branch`로 선택합니다.
4. Branch를 `main`, Folder를 `/ (root)`로 선택한 뒤 저장합니다.
5. 몇 분 뒤 표시되는 Pages URL로 접속합니다.

## 편집 포인트

- `index.html`의 DOI 버튼 링크는 원문 DOI로 연결되어 있습니다.
- PDF 원문을 직접 배포하려면 저작권 및 배포 권한을 확인한 뒤 `assets/`에 넣고 버튼 링크를 수정하세요.
- 이 페이지는 방어 목적 소개용이며 공격 구현 코드나 악성코드 삽입 절차를 포함하지 않습니다.
