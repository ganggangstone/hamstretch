<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-read-555?style=for-the-badge" alt="English"></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/%ED%95%9C%EA%B5%AD%EC%96%B4-selected-2ea44f?style=for-the-badge" alt="한국어"></a>
</p>

<p align="center">
  <img src="screenshots/ko/card-01.png" width="320" alt="쳇바퀴 위의 픽셀 햄스터">
</p>

<p align="center">눈이 쉬어야 할 때 알려주는 맥/윈도우 메뉴바 앱.</p>
<p align="center">무시해도 되고, 대신 그 횟수를 기록합니다.</p>
<p align="center">3.9MB · 유휴 CPU 0.43% · 업데이트 확인 외엔 인터넷 안 씀 · 무료</p>

---

## 왜 만들었나

20분마다 쉬라고 알려주는 앱은 대부분 화면을 강제로 잠급니다. 바쁠 때 한 번 걸리면
그 자리에서 지워집니다.

이 앱은 막지 않습니다. 미루기는 늘 클릭 한 번이고, 대신 얼마나 미뤘는지를
햄스터 볼과 주간 기록으로 보여줍니다.

## 한 세트는 40초

| | |
|---|---|
| 20초 | 햄스터가 화면 가장자리를 두 바퀴 돕니다. 눈으로 따라가세요. |
| 10초 | 창밖이나 먼 곳을 봅니다. 화면 안에서 눈을 굴려봐야 초점 거리는 그대로입니다. |
| 10초 | 같이 기지개를 켭니다. |

<p>
  <img src="screenshots/ko/card-05.png" width="420" alt="화면 구석에 뜨는 알림 카드">
  <img src="screenshots/ko/card-07.png" width="420" alt="주간 기록 화면">
</p>

## 설치

[다운로드 페이지](https://ganggangstone.github.io/hamstretch/)에서 받습니다.

macOS는 앱을 응용 프로그램 폴더로 옮기고 우클릭 → 열기로 실행합니다. 서명이
없어서 더블클릭은 막히고, 새 버전마다 한 번씩 필요합니다. Windows(베타)는
설치 파일을 실행하고, SmartScreen이 뜨면 "추가 정보 → 실행"을 누릅니다.

Homebrew를 쓴다면:

```bash
brew install --cask ganggangstone/tap/hamstretch
```

`brew upgrade`로 새 버전을 받으면 우클릭 절차가 없습니다.

## 수집하는 개인정보 없음

인터넷은 하루 한 번, 새 버전이 있는지 GitHub에서 확인할 때만 씁니다 — 그때도
사용 기록은 보내지 않습니다. 언제 무엇을 했는지는 이 컴퓨터 안의 파일 하나에
쌓이고, 그 파일은 밖으로 나가지 않습니다. 활동 모니터로 직접 확인할 수 있습니다.

## 만들면서 내린 결정

[DECISIONS.md](DECISIONS.md)에 결정 23개를 대안과 함께 적었습니다. 측정한 뒤
뒤집은 결정 두 개(유휴 CPU 기준, 주간 목표가 세는 대상)에는 별표를 달았습니다.

이 저장소에는 랜딩 페이지, 배포 파일, 결정 기록만 있고 앱 소스는 들어 있지
않습니다.
