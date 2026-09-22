// 랜딩 페이지. 앱과 같은 스프라이트·색 토큰을 쓴다.
//
// 언어는 브라우저 설정을 따르고 위 버튼으로 바꿀 수 있다.
// 문구를 여기 한 곳에 모아두는 이유는 앱의 i18n.js와 같다.
// 언어가 늘 때 HTML을 통째로 복사하면 한쪽만 고쳐져서 갈라진다.

import { PAL, CELL, IDLE, ACCESSORIES, BASES } from './src/sprites.js';

// 배포 주소가 정해지면 여기만 채우면 된다. 비어 있으면 그 링크는 화면에 안 나온다 —
// 갈 곳 없는 링크를 눌러보게 두는 것보다 없는 편이 낫다.
const REPO = 'https://github.com/ganggangstone/hamstretch';
// OS별로 받는 파일이 다르다. releases/latest는 목록 페이지라 한 번 더 눌러야 하는데,
// 자산 파일 이름을 직접 걸면 버튼을 누르자마자 다운로드가 시작된다.
const DOWNLOAD_MAC = `${REPO}/releases/download/v0.1.0/hamster_0.1.0_universal.dmg`;
const DOWNLOAD_WIN = `${REPO}/releases/download/v0.1.0/hamster_0.1.0_x64-setup.exe`;

const T = {
  ko: {
    brand: '기지개햄',
    title: '햄스터 따라<br />눈운동하고 기지개 켜는 앱',
    lead: '온종일 모니터 앞에 앉아 있는 나를 위해 만든 거북목과 눈 피로 방지 앱.',
    cta: '무료로 받기',
    ctaTop: '데모 보기',
    ctaDemo: '데모 해보기',
    notOpen: '아직 공개 전이에요. 먼저 데모로 만나보세요.',
    previewNote: '진짜 앱이에요. 위 버튼을 누르면 직접 만져볼 수 있어요.',
    ctaSoon: '곧 나와요',
    betaBadge: '베타',
    betaNote: '',

    shot1: '평소에는 쳇바퀴',
    shot2: '때가 되면 알림',
    shot3: '쌓이는 기록',

    instTitle: '설치',
    // OS별로 달라지는 문구. specs·ctaHint·inst1~3·warnTitle·warnBody는
    // apply()가 선택된 OS 것으로 덮어쓴다 — 위 키와 이름이 같아야 한다.
    os: {
      mac: {
        specs: 'macOS(인텔·Apple Silicon 모두) · 3.9MB · 인터넷 안 씀 · 무료',
        ctaHint: '처음 열 때만 우클릭 → 열기',
        download: DOWNLOAD_MAC,
        inst1: '앱을 <b>응용 프로그램</b>으로 옮겨요.',
        inst2: '앱을 <b>우클릭 → 열기</b>.',
        inst3: '메뉴바에 햄스터가 생기면 끝.',
        warnTitle: '"확인되지 않은 개발자"라고 뜨나요?',
        warnBody:
          '고장이 아니에요. 애플 서명이 없어서 더블클릭은 맥이 막아요. 우클릭(또는 control+클릭) → 열기 → 한 번 더 열기. 새 버전마다 한 번씩 필요해요.',
      },
      win: {
        specs: 'Windows(베타) · 1.5MB · 인터넷 안 씀 · 무료',
        ctaHint: '처음 열 때만 "추가 정보 → 실행"',
        download: DOWNLOAD_WIN,
        inst1: '내려받은 설치 파일을 <b>실행</b>해요.',
        inst2: '"Windows에서 PC를 보호했습니다"가 뜨면 <b>추가 정보 → 실행</b>.',
        inst3: '설치가 끝나면 트레이에 햄스터가 생기면 끝.',
        warnTitle: '"Windows에서 PC를 보호했습니다"라고 뜨나요?',
        warnBody:
          '고장이 아니에요. 서명이 없어서 SmartScreen이 한 번 막아요. 추가 정보 → 그래도 실행을 누르면 됩니다. 새 버전마다 한 번씩 필요해요.',
        beta: true,
        betaNote: '윈도우판은 아직 베타예요. 실제 기기에서 막 검증을 시작했어요 — 이상한 점이 있으면 아래 "문의·피드백"으로 알려주세요.',
      },
    },

    faqTitle: '자주 묻는 질문',
    faq: [
      ['배터리를 많이 쓰나요?', '하루 종일 켜둬도 배터리가 눈에 띄게 줄지 않아요. 쉬는 동안에는 화면 구석만 그리고, 운동할 때만 화면 전체를 써요.'],
      ['제 기록이 어디로 가나요?', '아무 데도 안 가요. 인터넷을 쓰지 않는 앱이라 언제 무엇을 했는지가 이 컴퓨터 안 파일 하나에만 쌓여요. 그 파일을 지우면 기록도 사라져요.'],
      ['윈도우에서도 되나요?', '베타로 돼요. 위에서 Windows를 고르면 받을 수 있어요. 아직 실기기 검증을 막 시작한 단계라 문제가 있을 수 있어요.'],
      ['소리가 나나요?', '안 나요. 화면 구석에 카드만 조용히 떠요.'],
      ['20분이 너무 잦아요.', '설정에서 10분, 20분, 30분, 45분, 60분 중에 고를 수 있어요.'],
      ['햄스터를 다른 자리에 두고 싶어요.', '메뉴바에서 "위치 옮기기"를 누르면 햄스터를 끌어서 옮길 수 있어요. 놓은 자리는 앱을 껐다 켜도 그대로예요.'],
      ['햄스터가 안 보이게 할 수 있나요?', '설정에서 끄면 평소에는 안 보여요. 눈운동할 때만 나타나요. 눈으로 따라갈 대상이 있어야 하니까요.'],
      ['모니터를 여러 대 써요.', '지금 마우스가 있는 화면으로 따라와요. 이것도 설정에서 끌 수 있어요.'],
      ['어떤 언어를 지원하나요?', '한국어와 영어요. 설정에서 바꿔요.'],
      ['다크 모드도 되나요?', '시스템 설정을 따라가고, 원하면 밝게나 어둡게로 고정할 수도 있어요.'],
      ['자리를 비우면요?', '3분 넘게 아무것도 안 누르면 알림을 띄우지 않아요. 돌아왔을 때 낡은 알림이 쌓여 있지 않아요.'],
      ['돈이 드나요?', '무료예요.'],
      ['지우고 싶어요.', '앱을 휴지통에 넣으면 끝이에요.'],
    ],

    footNote: '눈이 쉬어야 할 때 알려주는 맥 앱',
    footFeedback: '문의·피드백',
  },
  en: {
    brand: 'Hamstretch',
    title: 'Follow the hamster,<br />rest your eyes and stretch',
    lead: 'Made for someone who sits in front of a monitor all day.',
    cta: 'Get it free',
    ctaTop: 'Try the demo',
    ctaDemo: 'Try the demo',
    notOpen: 'Not out yet. Try the demo in the meantime.',
    previewNote: 'This is the real app. Press the button above to play with it.',
    ctaSoon: 'Coming soon',
    betaBadge: 'Beta',
    betaNote: '',

    shot1: 'It runs its wheel',
    shot2: 'A nudge when it is time',
    shot3: 'Breaks add up',

    instTitle: 'Install',
    os: {
      mac: {
        specs: 'macOS (Intel & Apple Silicon) · 3.9MB · never goes online · free',
        ctaHint: 'First launch: right-click → Open',
        download: DOWNLOAD_MAC,
        inst1: 'Drag the app into <b>Applications</b>.',
        inst2: '<b>Right-click → Open</b> the app.',
        inst3: 'A hamster appears in your menu bar.',
        warnTitle: 'Does macOS say the developer cannot be verified?',
        warnBody:
          'Nothing is broken. The app is unsigned, so a plain double-click gets blocked. Right-click (or control-click) → Open → Open again. Once per new version.',
      },
      win: {
        specs: 'Windows (beta) · 1.5MB · never goes online · free',
        ctaHint: 'First launch: "More info" → Run anyway',
        download: DOWNLOAD_WIN,
        inst1: 'Run the downloaded installer.',
        inst2: 'If "Windows protected your PC" appears, <b>More info → Run anyway</b>.',
        inst3: 'A hamster appears in your system tray once it is done.',
        warnTitle: 'Does it say "Windows protected your PC"?',
        warnBody:
          'Nothing is broken. The app is unsigned, so SmartScreen blocks it once. Click More info → Run anyway. Once per new version.',
        beta: true,
        betaNote: 'The Windows build is still in beta — real-device testing just started. If something looks off, use "Contact" below.',
      },
    },

    faqTitle: 'Questions people ask',
    faq: [
      ['Does it drain my battery?', 'Leave it on all day and you will not notice. It only draws a corner of the screen while idle, and uses the full screen during the 40 seconds.'],
      ['Where does my data go?', 'Nowhere. The app never goes online, so what you did and when is appended to a single file on your computer. Delete that file and the history is gone.'],
      ['Is there a Windows version?', 'Yes, in beta. Pick Windows above to get it. Real-device testing just started, so there may be rough edges.'],
      ['Does it make a sound?', 'No. A small card just appears in the corner.'],
      ['Every 20 minutes is too often.', 'You can pick 10, 20, 30, 45 or 60 minutes in settings.'],
      ['Can I move the hamster?', 'Choose "Move the hamster" from the menu bar and drag it anywhere. It stays there after a restart.'],
      ['Can I hide the hamster?', 'Turn it off in settings and it stays hidden until the next break. You need something to follow with your eyes.'],
      ['I use more than one display.', 'It follows whichever screen your cursor is on. You can turn that off in settings.'],
      ['Which languages does it speak?', 'English and Korean. Switch in settings.'],
      ['Is there a dark mode?', 'It follows your system, and you can pin it to light or dark.'],
      ['What if I step away?', 'If you have not touched anything for three minutes, it skips the reminder. You will not come back to a pile of old alerts.'],
      ['Does it cost anything?', 'It is free.'],
      ['How do I remove it?', 'Drag the app to the Trash. That is all.'],
    ],

    footNote: 'A Mac app that tells you when to rest your eyes',
    footFeedback: 'Contact',
  },
};

function drawHamster(canvas, { gear = ['glasses'], base = null }) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const baseDef = base ? BASES[base] : null;
  const scale = Math.floor(canvas.width / CELL);
  const drawn = CELL * scale;
  const x = Math.round((canvas.width - drawn) / 2);
  // 쳇바퀴(base)가 있으면 캐릭터를 위쪽에 붙이고 그 아래 공간에 쳇바퀴를 그린다
  // (히어로 캔버스가 이 경우다). 쳇바퀴가 없으면 캐릭터만 있으니 캔버스 안에서
  // 세로로 가운데 둔다 — 안 그러면 헤더처럼 옆에 텍스트가 있을 때 위로 붙어
  // 보인다(캔버스 44px 중 실제 그림은 24px라 아래 20px가 빈 채로 남았었다).
  const y = baseDef ? 0 : Math.round((canvas.height - drawn) / 2);

  const put = (col, row, key, s, ox, oy) => {
    const color = PAL[key];
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(ox + col * s, oy + row * s, s, s);
  };

  if (baseDef) {
    const bs = scale * baseDef.scale;
    for (const [col, row, key] of baseDef.layer(0.6)) {
      put(col, row, key, bs, x + (drawn - CELL * bs) / 2, y + drawn - scale * 4);
    }
  }
  for (let row = 0; row < CELL; row++) {
    const line = (IDLE[row] || '').padEnd(CELL, '.');
    for (let col = 0; col < CELL; col++) put(col, row, line[col], scale, x, y);
  }
  for (const id of gear) {
    for (const [col, row, key] of ACCESSORIES[id]?.layer ?? []) put(col, row, key, scale, x, y);
  }
}

// 지금 고른 언어·OS. 버튼 하나만 눌러도(언어든 OS든) 둘 다 반영해서 다시 그려야
// 하므로 모듈 전역에 둔다.
let currentLang = 'ko';
let currentOS = 'mac';

function apply(lang, os) {
  currentLang = lang;
  currentOS = os;
  // 언어 기본값 위에 OS별 값을 덮어쓴다 — specs·ctaHint·inst1~3·warnTitle·warnBody·
  // download·betaNote는 os 쪽 값이 이긴다. 같은 이름을 안 쓰면 그냥 무시된다.
  const t = { ...T[lang], ...T[lang].os[os] };
  document.documentElement.lang = lang;
  document.title = `${t.brand}, ${t.title.replace(/<br \/>/g, ' ')}`;

  for (const el of document.querySelectorAll('[data-t]')) {
    el.innerHTML = t[el.dataset.t];
  }

  // 받을 곳이 없으면 버튼을 잠근 채 두지 않고 아예 감춘다. 눌리지 않는 버튼은
  // "뭔가 고장났나"로 읽힌다. 대신 안내 문구 한 줄을 띄운다.
  const download = document.getElementById('download');
  download.hidden = !t.download;
  download.href = t.download || '#install';
  download.textContent = t.cta;
  document.getElementById('notice').hidden = !!t.download;
  // 설치 요령은 받을 수 있게 됐을 때만 의미가 있다. 버튼과 같이 나오고 같이 사라진다.
  document.querySelector('.hint').hidden = !t.download;

  // 베타 안내는 윈도우를 골랐을 때만 보인다.
  const betaNote = document.getElementById('betaNote');
  betaNote.hidden = !t.beta;

  // 받을 곳이 없는 동안 헤더 버튼은 데모로 보낸다.
  const top = document.getElementById('downloadTop');
  top.href = t.download || 'demo/?play=1';

  // FAQ는 목록이라 data-t로 못 넣는다. 접어두면 길이가 화면을 잡아먹지 않는다.
  document.getElementById('faq').innerHTML = t.faq
    .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
    .join('');

  const feedback = document.getElementById('feedback');
  feedback.href = REPO;
  feedback.hidden = !REPO;
  document.getElementById('year').textContent = new Date().getFullYear();

  // 알림 / 눈운동 / 기록 순서로 보여준다. 이 앱이 다른 20-20-20 앱과 갈리는 건
  // 마지막 '기록'이라 셋 중 하나로 반드시 넣는다.
  const shots = [
    ['card-04', t.shot1],
    ['card-05', t.shot2],
    ['card-07', t.shot3],
  ];
  document.getElementById('shots').innerHTML = shots
    .map(
      ([file, caption]) =>
        `<img src="screenshots/${lang}/${file}.png" alt="${caption}" />`,
    )
    .join('');

  for (const button of document.querySelectorAll('[data-lang]')) {
    button.classList.toggle('on', button.dataset.lang === lang);
  }
  for (const button of document.querySelectorAll('[data-os]')) {
    button.classList.toggle('on', button.dataset.os === os);
  }
  localStorage.setItem('siteLang', lang);
  localStorage.setItem('siteOS', os);
}

drawHamster(document.getElementById('mark'), { gear: ['glasses'] });
drawHamster(document.getElementById('hero'), { gear: ['glasses'], base: 'wheel' });

for (const button of document.querySelectorAll('[data-lang]')) {
  button.addEventListener('click', () => apply(button.dataset.lang, currentOS));
}
for (const button of document.querySelectorAll('[data-os]')) {
  button.addEventListener('click', () => apply(currentLang, button.dataset.os));
}

// ?lang=ko, ?os=win 으로 강제할 수 있다. 링크 하나로 "이 언어, 이 OS로 봐줘"가
// 된다 — 윈도우판을 친구에게 테스트해달라고 부탁할 때 ?os=win을 붙여서 보내면 된다.
function detectOS() {
  return /Win/i.test(navigator.userAgent || '') ? 'win' : 'mac';
}

const forcedLang = new URLSearchParams(location.search).get('lang');
const forcedOS = new URLSearchParams(location.search).get('os');
const savedLang = localStorage.getItem('siteLang');
const savedOS = localStorage.getItem('siteOS');
const autoLang = (navigator.language || 'en').toLowerCase().startsWith('ko') ? 'ko' : 'en';

const lang = T[forcedLang] ? forcedLang : T[savedLang] ? savedLang : autoLang;
const os = ['mac', 'win'].includes(forcedOS) ? forcedOS : ['mac', 'win'].includes(savedOS) ? savedOS : detectOS();
apply(lang, os);
