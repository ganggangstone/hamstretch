// 데모 페이지. 창(iframe) 세 개를 진짜 앱 창처럼 다룬다.
//
// 앱에서 Rust가 하던 일 중 '창을 움직이는 것'만 여기서 대신한다.
// 나머지(기록 읽고 쓰기)는 각 iframe 안의 shim.js가 localStorage로 처리한다.
const pet = document.getElementById('pet');
const promptFrame = document.getElementById('prompt');
const dash = document.getElementById('dash');
const screen = document.getElementById('screen');
const frames = () => [pet, promptFrame, dash];

const REST = 240; // 대기 중 펫 창 크기. 앱과 같은 값이다.

function send(frame, message) {
  frame.contentWindow?.postMessage({ hamstretch: true, ...message }, '*');
}

function broadcast(event, payload) {
  for (const frame of frames()) send(frame, { type: 'event', event, payload });
}

// 펫 창 크기. 운동할 때만 화면 전체를 쓴다 — 앱에서 상시 전체 화면이
// 유휴 CPU를 2.5배로 올렸던 것과 같은 이유로 구조를 그대로 뒀다.
function setStage(full) {
  pet.classList.toggle('full', full);
  if (!full) {
    pet.style.width = `${REST}px`;
    pet.style.height = `${REST}px`;
  } else {
    pet.style.width = '100%';
    pet.style.height = '100%';
  }
}

const commands = {
  set_stage: ({ full }) => setStage(!!full),
  set_pet_visible: ({ show }) => { pet.style.visibility = show ? 'visible' : 'hidden'; },
  show_prompt: () => { promptFrame.hidden = false; },
  hide_prompt: () => { promptFrame.hidden = true; },
};

window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data?.hamstretch) return;

  if (data.type === 'emit') broadcast(data.event, data.payload);

  if (data.type === 'invoke') {
    const value = commands[data.cmd]?.(data.args ?? {}) ?? null;
    // 물어본 창에만 답한다. 요청 번호는 창마다 1부터 세므로 전체에 뿌리면
    // 펫 창의 1번 답이 알림 창의 1번 요청을 엉뚱하게 깨운다.
    e.source?.postMessage({ hamstretch: true, type: 'reply', id: data.id, value }, '*');
  }
});

setStage(false);

// 지난 한 주치 기록을 미리 깔아둔다. 빈 화면에서는 '기록이 쌓인다'는 것이
// 이 앱의 핵심이라는 게 보이지 않는다. 방문자가 누른 것은 여기에 이어서 쌓인다.
const KEY = 'demo-events';
const SEED = 'demo-seeded';

function seed() {
  if (localStorage.getItem(SEED)) return;
  const day = 86400000;
  const now = Date.now();
  const plan = [
    [6, ['done', 'done', 'snooze', 'done']],
    [5, ['done', 'done', 'done', 'ignored', 'done']],
    [4, ['snooze', 'done', 'done']],
    [3, ['done', 'done', 'done', 'done']],
    [2, ['done', 'ignored', 'snooze', 'done']],
    [1, ['done', 'done', 'done']],
  ];
  const lines = [];
  for (const [ago, kinds] of plan) {
    kinds.forEach((type, i) => {
      lines.push(JSON.stringify({ t: now - ago * day + (10 + i) * 3600000, type }));
    });
  }
  localStorage.setItem(KEY, lines.join('\n') + '\n');
  localStorage.setItem(SEED, '1');
}
seed();

// --- 안내 --------------------------------------------------------------
// 들어온 사람은 이 앱을 처음 본다. 한 번에 한 가지만 시키고,
// 방금 무엇이 일어났는지 말해준다. 다음 단계는 앱이 실제로 보낸 이벤트로 넘어간다.
const STEPS = {
  start: {
    no: '1단계',
    text: '20분이 지났다고 해볼까요. 햄스터가 부르러 옵니다.',
    button: '알림 받기',
    run: () => broadcast('debug-prompt'),
  },
  prompted: {
    no: '2단계',
    text: '오른쪽 아래에 알림이 떴어요. 바쁘면 미뤄도 되고, 지금 해도 돼요. 직접 눌러보세요.',
    button: null,
  },
  snoozed: {
    no: '2단계',
    text: '미뤘어요. 앱은 붙잡지 않아요. 대신 미룬 횟수가 기록에 남아요.',
    button: '다시 알림 받기',
    run: () => broadcast('debug-prompt'),
  },
  exercising: {
    no: '3단계',
    text: '40초 운동이에요. 햄스터를 눈으로 따라가다가, 먼 곳을 보고, 같이 기지개를 켭니다.',
    button: null,
  },
  done: {
    no: '4단계',
    text: '끝났어요. 한 것도 미룬 것도 전부 기록으로 남습니다.',
    button: '기록 보기',
    run: () => {
      document.getElementById('sheet').hidden = false;
      broadcast('stats-changed');
      document.getElementById('sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
      step('after');
    },
  },
  after: {
    no: '5단계',
    text: '마지막으로 꾸며보세요. 소품은 겹쳐 입을 수 있고, 발밑은 하나만 고릅니다.',
    button: null,
    gear: true,
  },
};

const go = document.getElementById('go');

function step(name) {
  const it = STEPS[name];
  document.getElementById('stepNo').textContent = it.no;
  document.getElementById('stepText').textContent = it.text;
  go.hidden = !it.button;
  if (it.button) go.textContent = it.button;
  go.onclick = it.run ?? null;
  document.getElementById('gear').hidden = !it.gear;
}

// --- 꾸미기 ------------------------------------------------------------
// 앱에서 소품은 설정의 worn 목록 하나로 정해진다. 데모도 같은 목록을 고치고
// settings-changed를 쏘기만 하면 된다 — 그리는 일은 앱 코드가 그대로 한다.
const WORN = 'worn';

function wornList() {
  try {
    const list = JSON.parse(localStorage.getItem(WORN) ?? '["glasses"]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function buildGear() {
  const box = document.getElementById('gear');
  const items = [['glasses', '안경']];
  const bases = [['wheel', '쳇바퀴']];

  for (const pack of window.DEMO_PACKS ?? []) {
    for (const [id, item] of Object.entries(pack.accessories ?? {})) {
      items.push([`${pack.id}:${id}`, item.name?.ko ?? id]);
    }
    // 발밑(쳇바퀴·키보드)은 겹쳐 입는 게 아니라 하나만 고른다. 앱도 그렇다.
    for (const [id, item] of Object.entries(pack.bases ?? {})) {
      bases.push([`${pack.id}:${id}`, item.name?.ko ?? id]);
    }
  }

  box.innerHTML =
    items.map(([id, label]) => `<button type="button" data-gear="${id}">${label}</button>`).join('') +
    '<span class="sep"></span>' +
    bases.map(([id, label]) => `<button type="button" data-base="${id}">${label}</button>`).join('') +
    '<span class="soon">겨울 세트는 준비 중</span>';

  const paint = () => {
    const worn = wornList();
    const base = localStorage.getItem('base') ?? 'wheel';
    for (const button of box.querySelectorAll('[data-gear]')) {
      button.classList.toggle('on', worn.includes(button.dataset.gear));
    }
    for (const button of box.querySelectorAll('[data-base]')) {
      button.classList.toggle('on', button.dataset.base === base);
    }
  };

  box.addEventListener('click', (e) => {
    const gear = e.target?.dataset?.gear;
    const base = e.target?.dataset?.base;
    if (gear) {
      const worn = wornList();
      const next = worn.includes(gear) ? worn.filter((x) => x !== gear) : [...worn, gear];
      localStorage.setItem(WORN, JSON.stringify(next));
    } else if (base) {
      localStorage.setItem('base', base);
    } else {
      return;
    }
    paint();
    broadcast('settings-changed');
  });

  paint();
}
buildGear();

// 다음 단계는 앱이 실제로 보낸 이벤트를 보고 넘어간다.
// 버튼을 누른 시점으로 짐작하면 앱 동작과 안내가 어긋난다.
const WATCH = {
  'prompt-show': 'prompted',
  'prompt-snooze': 'snoozed',
  'prompt-accept': 'exercising',
};

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data?.hamstretch && data.type === 'emit' && WATCH[data.event]) step(WATCH[data.event]);
});

// 운동이 끝나면 펫 창이 기록을 남기고 stats-changed를 쏜다. 그때가 4단계다.
let exercising = false;
window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data?.hamstretch || data.type !== 'emit') return;
  if (data.event === 'prompt-accept') exercising = true;
  if (data.event === 'stats-changed' && exercising) {
    exercising = false;
    step('done');
  }
});

document.getElementById('closeDash').addEventListener('click', () => {
  document.getElementById('sheet').hidden = true;
});

document.getElementById('reset').addEventListener('click', () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SEED);
  location.reload();
});

step('start');

// 가짜 바탕화면의 시계. 멈춰 있으면 화면이 죽어 보인다.
function clock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}
clock();
setInterval(clock, 30000);
