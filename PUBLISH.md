# 올리는 법

이 폴더는 `node tools/build-site.mjs`가 만든 결과물이다. **직접 고치지 말 것** —
다음 빌드에서 덮어써진다. 고칠 곳은 앱 저장소의 `index.html` / `site.js` / `site.css` / `docs/ADR.md`.

1. 공개 저장소에 이 폴더 내용을 통째로 넣는다
2. Settings → Pages → Source: main 브랜치 / 루트(`/`)
3. Releases에 `.dmg`를 올리고, `site.js`의 `REPO`와 `DOWNLOAD`를 채운다

앱 소스는 들어 있지 않다. `src/sprites.js`는 랜딩이 햄스터를 그리는 데 쓰는 도트 데이터다.
