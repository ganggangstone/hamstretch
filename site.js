// 랜딩 페이지. 앱과 같은 스프라이트·색 토큰을 쓴다.
//
// 언어는 브라우저 설정을 따르고 위 버튼으로 바꿀 수 있다.
// 문구를 여기 한 곳에 모아두는 이유는 앱의 i18n.js와 같다.
// 언어가 늘 때 HTML을 통째로 복사하면 한쪽만 고쳐져서 갈라진다.

import { PAL, CELL, IDLE, ACCESSORIES, BASES } from './src/sprites.js';

// 배포 주소가 정해지면 여기만 채우면 된다. 비어 있으면 그 링크는 화면에 안 나온다 —
// 갈 곳 없는 링크를 눌러보게 두는 것보다 없는 편이 낫다.
const REPO = '';
const DOWNLOAD = ''; // 예: `${REPO}/releases/latest`

const T = {
  ko: {
    brand: '기지개햄',
    title: '햄스터 따라<br />눈운동하고 기지개 켜는 앱',
    lead: '온종일 모니터 앞에 앉아 있는 나를 위해 만든 거북목과 눈 피로 방지 앱.',
    cta: '무료로 받기',
    ctaTop: '설치하기',
    ctaSoon: '곧 나와요',
    specs: '맥 전용 · 4MB · 인터넷 안 씀 · 무료',
    ctaHint: '처음 열 때만 우클릭 → 열기',

    shot1: '평소에는 쳇바퀴',
    shot2: '때가 되면 알림',
    shot3: '쌓이는 기록',


    instTitle: '설치',
    inst1: '앱을 <b>응용 프로그램</b>으로 옮겨요.',
    inst2: '앱을 <b>우클릭 → 열기</b>.',
    inst3: '메뉴바에 햄스터가 생기면 끝.',
    warnTitle: '"확인되지 않은 개발자"라고 뜨나요?',
    warnBody:
      '고장이 아니에요. 애플 서명이 없어서 더블클릭은 맥이 막아요. 우클릭(또는 control+클릭) → 열기 → 한 번 더 열기. 새 버전마다 한 번씩 필요해요.',

    faqTitle: '자주 묻는 질문',
    faq: [
      ['배터리를 많이 쓰나요?', '하루 종일 켜둬도 배터리가 눈에 띄게 줄지 않아요. 쉬는 동안에는 화면 구석만 그리고, 운동할 때만 화면 전체를 써요.'],
      ['제 기록이 어디로 가나요?', '아무 데도 안 가요. 인터넷을 쓰지 않는 앱이라 언제 무엇을 했는지가 이 맥 안 파일 하나에만 쌓여요. 그 파일을 지우면 기록도 사라져요.'],
      ['윈도우에서도 되나요?', '지금은 맥만 돼요. 윈도우는 준비하고 있어요.'],
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
    ctaTop: 'Install',
    ctaSoon: 'Coming soon',
    specs: 'For Mac · 4MB · never goes online · free',
    ctaHint: 'First launch: right-click → Open',

    shot1: 'It runs its wheel',
    shot2: 'A nudge when it is time',
    shot3: 'Breaks add up',


    instTitle: 'Install',
    inst1: 'Drag the app into <b>Applications</b>.',
    inst2: '<b>Right-click → Open</b> the app.',
    inst3: 'A hamster appears in your menu bar.',
    warnTitle: 'Does macOS say the developer cannot be verified?',
    warnBody:
      'Nothing is broken. The app is unsigned, so a plain double-click gets blocked. Right-click (or control-click) → Open → Open again. Once per new version.',

    faqTitle: 'Questions people ask',
    faq: [
      ['Does it drain my battery?', 'Leave it on all day and you will not notice. It only draws a corner of the screen while idle, and uses the full screen during the 40 seconds.'],
      ['Where does my data go?', 'Nowhere. The app never goes online, so what you did and when is appended to a single file on your Mac. Delete that file and the history is gone.'],
      ['Is there a Windows version?', 'Not yet. Mac only for now, but Windows is in the works.'],
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
  const y = 0;

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

function apply(lang) {
  const t = T[lang];
  document.documentElement.lang = lang;
  document.title = `${t.brand}, ${t.title.replace(/<br \/>/g, ' ')}`;

  for (const el of document.querySelectorAll('[data-t]')) {
    el.innerHTML = t[el.dataset.t];
  }

  const download = document.getElementById('download');
  if (DOWNLOAD) {
    download.href = DOWNLOAD;
    download.textContent = t.cta;
    download.classList.remove('soon');
  } else {
    // 링크가 없으면 누를 수 있는 것처럼 보이면 안 된다.
    download.href = '#install';
    download.textContent = t.ctaSoon;
    download.classList.add('soon');
  }

  // 헤더 버튼은 받는 곳이 정해지기 전에도 설치 안내로 데려다주면 되므로 늘 살아 있다.
  document.getElementById('downloadTop').href = DOWNLOAD || '#install';

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
        `<img src="marketing/${lang}/${file}.png" alt="${caption}" />`,
    )
    .join('');

  for (const button of document.querySelectorAll('[data-lang]')) {
    button.classList.toggle('on', button.dataset.lang === lang);
  }
  localStorage.setItem('siteLang', lang);
}

drawHamster(document.getElementById('mark'), { gear: ['glasses'] });
drawHamster(document.getElementById('hero'), { gear: ['glasses'], base: 'wheel' });

for (const button of document.querySelectorAll('[data-lang]')) {
  button.addEventListener('click', () => apply(button.dataset.lang));
}

// ?lang=ko 로 강제할 수 있다. 특정 언어 페이지를 링크로 공유할 때 쓴다.
const forced = new URLSearchParams(location.search).get('lang');
const saved = localStorage.getItem('siteLang');
const auto = (navigator.language || 'en').toLowerCase().startsWith('ko') ? 'ko' : 'en';
apply(T[forced] ? forced : T[saved] ? saved : auto);
