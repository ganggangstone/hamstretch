// 랜딩 페이지. 앱과 같은 스프라이트·색 토큰을 쓴다.
//
// 언어는 브라우저 설정을 따르고 위 버튼으로 바꿀 수 있다.
// 문구를 여기 한 곳에 모아두는 이유는 앱의 i18n.js와 같다.
// 언어가 늘 때 HTML을 통째로 복사하면 한쪽만 고쳐져서 갈라진다.

import { PAL, CELL, IDLE, ACCESSORIES, BASES } from './src/sprites.js';

// /en/ 같은 하위 경로 페이지도 이 스크립트를 그대로 불러다 쓴다. 문서 URL
// 기준 상대경로("screenshots/...")를 쓰면 그 페이지 밑에서 찾아버려 깨진다.
// 이 스크립트 자신의 위치(site.js가 항상 있는 실제 사이트 루트) 기준으로 고정한다.
const SITE_ROOT = new URL('.', import.meta.url).href;

// 배포 주소가 정해지면 여기만 채우면 된다. 비어 있으면 그 링크는 화면에 안 나온다.
// 갈 곳 없는 링크를 눌러보게 두는 것보다 없는 편이 낫다.
const REPO = 'https://github.com/ganggangstone/hamstretch';
// OS별로 받는 파일이 다르다. releases/latest는 목록 페이지라 한 번 더 눌러야 하는데,
// 자산 파일 이름을 직접 걸면 버튼을 누르자마자 다운로드가 시작된다.
const DOWNLOAD_MAC = `${REPO}/releases/download/v0.1.1/Hamstretch_0.1.1_universal.dmg`;
const DOWNLOAD_WIN = `${REPO}/releases/download/v0.1.1/Hamstretch_0.1.1_x64-setup.exe`;

const T = {
  ko: {
    trust: "macOS와 Windows에서 무료로 사용할 수 있어요.",
    featuresTitle: "쉬는 시간은 이렇게 흘러가요.",
    snoozeTitle: "바쁠 땐 15분 미뤄요.",
    snoozeBody: "<span class=\"copy-line\">화면 구석에 작은 알림이 떠요.</span><span class=\"copy-line\">지금 쉬기 어려우면 한 번 눌러 미루세요.</span>",
    routineTitle: "햄스터와 40초 쉬어요.",
    routineBody: "<span class=\"copy-line\">햄스터를 따라 눈을 움직이고,</span><span class=\"copy-line\">먼 곳을 본 뒤 기지개를 켜요.</span>",
    recordTitle: "이번 주에는 얼마나 쉬었나요?",
    recordBody: "<span class=\"copy-line\">쉰 횟수와 미룬 횟수는</span><span class=\"copy-line\">주간 기록에서 확인할 수 있어요.</span>",
    eyeStep: "햄스터 따라가기",
    farStep: "먼 곳 보기",
    stretchStep: "기지개 켜기",
    wardrobeTitle: "햄스터도 옷을 갈아입어요.",
    wardrobeBody: "<span class=\"copy-line\">후드티를 입히거나 헤드폰을 씌워보세요.</span><span class=\"copy-line\">아래 소품을 눌러 조합할 수 있어요.</span>",
    defaultLook: "기본 햄스터",
    devLook: "개발자 세트",
    resetLook: "기본으로",
    wardrobeNote: "꾸미기 아이템은 판매 준비 중이에요.",
    finalTitle: "다음 휴식은 햄스터와 함께.",
    finalBody: "설치하고 알림 간격을 고르면 돼요.",
    brand: '기지개햄',
    title: "<span class=\"headline-line\">컴퓨터 앞에서</span><span class=\"headline-line\">쉬는 걸 잊는다면.</span>",
    lead: "<span class=\"copy-line\">20분마다 햄스터가 알려줘요.</span><span class=\"copy-line\">잠깐 먼 곳을 보고 기지개를 켜세요.</span>",
    pageTitle: "기지개햄 | 눈 휴식·스트레칭 알림 앱 (맥·윈도우)",
    cta: '무료로 받기',
    ctaTop: "무료 다운로드",
    ctaDemo: "설치 없이 데모 보기 →",
    notOpen: '원티드 AI 챔피언십 제출작이에요. 대회 규정상 설치 파일 대신 데모로 보여드립니다. 위 데모를 확인해주세요. 응원하고 싶으시면 <a href="https://event.wanted.co.kr/ai-championship/2026/projects/1723" target="_blank" rel="noopener">투표 한 번</a> 부탁드려요!',
    previewNote: "알림이 뜨면 지금 쉬거나, 잠깐 미뤄보세요.",
    ctaSoon: '곧 나와요',
    betaBadge: '베타',
    betaNote: '',


    instTitle: '설치',
    // OS별로 달라지는 문구. specs·ctaHint·inst1~3·warnTitle·warnBody는
    // apply()가 선택된 OS 것으로 덮어쓴다. 위 키와 이름이 같아야 한다.
    os: {
      mac: {
        specs: 'macOS(인텔·Apple Silicon 모두) · 3.9MB · 업데이트 확인 외엔 인터넷 안 씀 · 무료',
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
        specs: 'Windows(베타) · 1.5MB · 업데이트 확인 외엔 인터넷 안 씀 · 무료',
        ctaHint: '처음 열 때만 "추가 정보 → 실행"',
        download: DOWNLOAD_WIN,
        inst1: '내려받은 설치 파일을 <b>실행</b>해요.',
        inst2: '"Windows에서 PC를 보호했습니다"가 뜨면 <b>추가 정보 → 실행</b>.',
        inst3: '설치가 끝나면 트레이에 햄스터가 생기면 끝.',
        warnTitle: '"Windows에서 PC를 보호했습니다"라고 뜨나요?',
        warnBody:
          '고장이 아니에요. 서명이 없어서 SmartScreen이 한 번 막아요. 추가 정보 → 그래도 실행을 누르면 됩니다. 새 버전마다 한 번씩 필요해요.',
        beta: true,
        betaNote: '윈도우판은 아직 베타예요. 실제 기기에서 막 검증을 시작했어요. 이상한 점이 있으면 아래 "문의·피드백"으로 알려주세요.',
      },
    },

    faqTitle: "궁금한 점",
    faq: [
      ["거북목이나 허리 건강이 신경 쓰여요.", "오래 앉아 있다면 알림을 계기로 자세를 바꾸거나 자리에서 일어나 보세요. 기지개햄은 쉬는 시간을 알려주고 기지개를 함께하는 앱이에요."],
      ['배터리를 많이 쓰나요?', '대기 중에는 작은 햄스터 창만 표시하고, 운동할 때 화면 전체를 사용해요. 유휴 CPU 사용량은 측정 환경에서 0.43%였어요.'],
      ['제 기록이 어디로 가나요?', '아무 데도 안 가요. 기록은 이 컴퓨터 안 파일 하나에만 쌓여요. 인터넷은 하루 한 번, 새 버전이 있는지 확인할 때만 GitHub에 접속하고 그때도 기록은 보내지 않아요. 파일을 지우면 기록도 사라져요.'],
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

    footNote: "눈 휴식과 스트레칭을 알려주는 무료 맥·윈도우 앱",
    footFeedback: '문의·피드백',
  },
  en: {
    trust: "Free for macOS and Windows.",
    featuresTitle: "A little time away from your screen.",
    snoozeTitle: "Busy? Snooze for 15 minutes.",
    snoozeBody: "<span class=\"copy-line\">A small reminder appears in the corner.</span><span class=\"copy-line\">Busy right now? Snooze it with one click.</span>",
    routineTitle: "Take a 40-second break together.",
    routineBody: "<span class=\"copy-line\">Follow the hamster with your eyes.</span><span class=\"copy-line\">Look into the distance, then stretch.</span>",
    recordTitle: "How often did you take a break?",
    recordBody: "<span class=\"copy-line\">Your weekly log shows the breaks you took</span><span class=\"copy-line\">and the reminders you snoozed.</span>",
    eyeStep: "Follow the hamster",
    farStep: "Look into the distance",
    stretchStep: "Stretch together",
    wardrobeTitle: "Give your hamster a change of clothes.",
    wardrobeBody: "<span class=\"copy-line\">Try a hoodie or a pair of headphones.</span><span class=\"copy-line\">Pick the accessories below to mix them.</span>",
    defaultLook: "Default hamster",
    devLook: "Developer Set",
    resetLook: "Reset",
    wardrobeNote: "Accessory packs are being prepared for sale.",
    finalTitle: "Take your next break with a hamster.",
    finalBody: "Install it and choose your reminder interval.",
    brand: 'Hamstretch',
    title: "<span class=\"headline-line\">Forget to take breaks</span><span class=\"headline-line\">at your computer?</span>",
    lead: "<span class=\"copy-line\">A hamster reminds you every 20 minutes.</span><span class=\"copy-line\">Look into the distance, then stretch.</span>",
    pageTitle: "Hamstretch | Eye Break & Desk Stretch Reminders for Mac and Windows",
    cta: 'Get it free',
    ctaTop: "Download",
    ctaDemo: "Try the demo without installing →",
    notOpen: 'This is a Wanted AI Championship entry. Contest rules mean I\'m showing a demo instead of a download. Try the demo above. A <a href="https://event.wanted.co.kr/ai-championship/2026/projects/1723" target="_blank" rel="noopener">vote</a> would mean a lot if you like it!',
    previewNote: "When the reminder appears, take a break or try snoozing it.",
    ctaSoon: 'Coming soon',
    betaBadge: 'Beta',
    betaNote: '',


    instTitle: 'Install',
    os: {
      mac: {
        specs: 'macOS (Intel & Apple Silicon) · 3.9MB · online only to check for updates · free',
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
        specs: 'Windows (beta) · 1.5MB · online only to check for updates · free',
        ctaHint: 'First launch: "More info" → Run anyway',
        download: DOWNLOAD_WIN,
        inst1: 'Run the downloaded installer.',
        inst2: 'If "Windows protected your PC" appears, <b>More info → Run anyway</b>.',
        inst3: 'A hamster appears in your system tray once it is done.',
        warnTitle: 'Does it say "Windows protected your PC"?',
        warnBody:
          'Nothing is broken. The app is unsigned, so SmartScreen blocks it once. Click More info → Run anyway. Once per new version.',
        beta: true,
        betaNote: 'The Windows build is still in beta. Real-device testing just started. If something looks off, use "Contact" below.',
      },
    },

    faqTitle: "Questions",
    faq: [
      ["What if I am concerned about tech neck or back health?", "Use a reminder as a cue to change position or get up after sitting for a while. Hamstretch reminds you to take breaks and stretch."],
      ['How much CPU does it use?', 'Idle CPU usage measured 0.43% in the development environment. The app uses a small window while idle and the full screen during a break.'],
      ['Where does my data go?', 'Nowhere. What you did and when is appended to a single file on your computer. The app goes online once a day, only to check GitHub for a new version tag. Your history is never sent. Delete that file and the history is gone.'],
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

    footNote: "Free eye break and stretching reminders for Mac and Windows",
    footFeedback: 'Contact',
  },
};

function drawHamster(canvas, { gear = ['glasses'], base = null }) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pack = window.DEMO_PACKS?.[0];
  const baseDef = base === 'keyboard' ? pack?.bases?.keyboard : base ? BASES[base] : null;
  const scale = Math.floor(canvas.width / CELL);
  const drawn = CELL * scale;
  const x = Math.round((canvas.width - drawn) / 2);
  // 쳇바퀴(base)가 있으면 캐릭터를 위쪽에 붙이고 그 아래 공간에 쳇바퀴를 그린다
  // (히어로 캔버스가 이 경우다). 쳇바퀴가 없으면 캐릭터만 있으니 캔버스 안에서
  // 세로로 가운데 둔다. 안 그러면 헤더처럼 옆에 텍스트가 있을 때 위로 붙어
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
    for (const [col, row, key] of (typeof baseDef.layer === 'function' ? baseDef.layer(0.6) : baseDef.layer)) {
      put(col, row, key, bs, x + (drawn - CELL * bs) / 2, y + drawn - scale * 4);
    }
  }
  for (let row = 0; row < CELL; row++) {
    const line = (IDLE[row] || '').padEnd(CELL, '.');
    for (let col = 0; col < CELL; col++) put(col, row, line[col], scale, x, y);
  }
  for (const id of gear) {
    for (const [col, row, key] of (ACCESSORIES[id] ?? pack?.accessories?.[id])?.layer ?? []) put(col, row, key, scale, x, y);
  }
}

// 지금 고른 언어·OS. 버튼 하나만 눌러도(언어든 OS든) 둘 다 반영해서 다시 그려야
// 하므로 모듈 전역에 둔다.
let currentLang = 'ko';
let currentOS = 'mac';

function apply(lang, os) {
  currentLang = lang;
  currentOS = os;
  // 언어 기본값 위에 OS별 값을 덮어쓴다. specs·ctaHint·inst1~3·warnTitle·warnBody·
  // download·betaNote는 os 쪽 값이 이긴다. 같은 이름을 안 쓰면 그냥 무시된다.
  const t = { ...T[lang], ...T[lang].os[os] };
  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  for (const el of document.querySelectorAll('[data-t]')) {
    el.innerHTML = t[el.dataset.t];
  }

  // 받을 곳이 없으면 버튼을 잠근 채 두지 않고 아예 감춘다. 눌리지 않는 버튼은
  // "뭔가 고장났나"로 읽힌다. 대신 안내 문구 한 줄을 띄운다.
  const download = document.getElementById('download');
  download.hidden = !t.download;
  download.href = t.download || '#install';
  const downloadLabel = lang === 'ko' ? `${os === 'mac' ? 'macOS' : 'Windows'}용 무료 다운로드` : `Download for ${os === 'mac' ? 'macOS' : 'Windows'}`;
  download.textContent = downloadLabel;
  document.getElementById('notice').hidden = !!t.download;
  // 설치 요령은 받을 수 있게 됐을 때만 의미가 있다. 버튼과 같이 나오고 같이 사라진다.
  document.querySelector('.hint').hidden = !t.download;

  // 베타 안내는 윈도우를 골랐을 때만 보인다.
  const betaNote = document.getElementById('betaNote');
  betaNote.hidden = !t.beta;

  // 받을 곳이 없는 동안 헤더 버튼은 데모로 보낸다.
  const top = document.getElementById('downloadTop');
  top.href = t.download || `${SITE_ROOT}demo/?play=1&lang=${lang}`;
  const bottom = document.getElementById('downloadBottom');
  bottom.href = top.href;
  bottom.textContent = t.download ? downloadLabel : t.ctaDemo;
  document.getElementById('demo').href = `${SITE_ROOT}demo/?play=1&lang=${lang}`;

  // FAQ는 목록이라 data-t로 못 넣는다. 접어두면 길이가 화면을 잡아먹지 않는다.
  document.getElementById('faq').innerHTML = t.faq
    .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
    .join('');

  const feedback = document.getElementById('feedback');
  feedback.href = REPO;
  feedback.hidden = !REPO;
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('downloadOS').value = os;
  localStorage.setItem('siteOS', os);
}

drawHamster(document.getElementById('mark'), { gear: ['glasses'] });


document.getElementById('downloadOS').addEventListener('change', (event) => {
  apply(currentLang, event.target.value);
});

// ?os=win 으로 강제할 수 있다. 윈도우판을 친구에게 테스트해달라고 부탁할 때
// 붙여서 보내면 된다.
function detectOS() {
  return /Win/i.test(navigator.userAgent || '') ? 'win' : 'mac';
}

// 언어는 더 이상 여기서 고르지 않는다. 페이지 자체가 언어별로 갈려 있다
// (루트 = 한국어, /en/ = 영어). 검색엔진이 언어별로 따로 색인하려면 URL이
// 실제로 갈라져 있어야 하고, ?lang= 같은 파라미터는 보통 같은 URL로
// 합쳐져서 안 먹힌다. <html lang="..">이 그 페이지의 언어를 그대로 말해준다.
const lang = document.documentElement.lang === 'en' ? 'en' : 'ko';

const forcedOS = new URLSearchParams(location.search).get('os');
const savedOS = localStorage.getItem('siteOS');
const os = ['mac', 'win'].includes(forcedOS) ? forcedOS : ['mac', 'win'].includes(savedOS) ? savedOS : detectOS();
apply(lang, os);

// Preview uses the existing pack's pixel data; it does not install anything.
const previewGear = new Set(['hood', 'headphones', 'coffee', 'keyboard']);
function paintLook() {
  drawHamster(document.getElementById('customPet'), {
    gear: ['glasses', ...[...previewGear].filter(id => id !== 'keyboard')],
    base: previewGear.has('keyboard') ? 'keyboard' : 'wheel',
  });
  for (const button of document.querySelectorAll('[data-gear]')) {
    button.setAttribute('aria-pressed', String(previewGear.has(button.dataset.gear)));
  }
}
drawHamster(document.getElementById('defaultPet'), { gear: ['glasses'], base: 'wheel' });
const pack = window.DEMO_PACKS?.[0];
for (const [id, item] of Object.entries({ ...pack?.accessories, ...pack?.bases })) {
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.gear = id;
  button.textContent = item.name?.[lang] ?? item.name?.en ?? id;
  button.addEventListener('click', () => {
    previewGear.has(id) ? previewGear.delete(id) : previewGear.add(id);
    paintLook();
  });
  document.getElementById('gearChoices').append(button);
}
document.getElementById('resetLook').addEventListener('click', () => { previewGear.clear(); paintLook(); });
paintLook();
