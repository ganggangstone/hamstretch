// 펫 창. 햄스터를 그리고 운동 시퀀스를 재생한다.
//
// 배터리가 이 앱의 생사를 가르므로 렌더 주기는 상태에 따라 다르게 잡는다.
// 대기 중에는 숨쉬기 한 번(1.2초)마다만, 운동 중에만 초당 20프레임.

import {
  PAL, CELL, IDLE, ARMS_UP, puffLayer, FEET_A, FEET_B,
} from './sprites.js';
import { gearLayers, allBases } from './outfit.js';
import { refreshPacks } from './packs.js';
import { t, getLang, refreshLang } from './i18n.js';
import { applyTheme } from './theme.js';
import { get, set } from './settings-store.js';
import { log, todayCount, isOffToday, DONE, SNOOZE, OFF, IGNORED } from './events.js';

const { invoke } = window.__TAURI__.core;
const { listen, emit } = window.__TAURI__.event;

const SCALE = 4; // 정수배만 — 픽셀아트는 보간하면 뭉개진다
const SIZE = CELL * SCALE;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const bubble = document.getElementById('bubble');
const mover = document.getElementById('mover');
const moverHint = document.getElementById('moverHint');
const moverDone = document.getElementById('moverDone');

let W = 0;
let H = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}
resize();
window.addEventListener('resize', resize);

// 오버레이 한 장만 그린다(쳇바퀴처럼 몸통 뒤에 깔리는 것).
// 배율을 따로 받는다 — 쳇바퀴는 햄스터보다 커야 뒤에서 보인다.
function drawLayer(layer, x, y, scale = SCALE) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  for (const [col, row, key] of layer) {
    const color = PAL[key];
    if (!color) continue;
    ctx.fillStyle = color;
    ctx.fillRect(col * scale, row * scale, scale, scale);
  }
  ctx.restore();
}

function drawSprite(base, overlays, x, y, flip) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (flip) {
    ctx.translate(SIZE, 0);
    ctx.scale(-1, 1);
  }
  for (let row = 0; row < CELL; row++) {
    const line = (base[row] || '').padEnd(CELL, '.');
    for (let col = 0; col < CELL; col++) {
      const color = PAL[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }
  for (const layer of overlays) {
    for (const [col, row, key] of layer) {
      const color = PAL[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }
  ctx.restore();
}

// --- 말풍선 -------------------------------------------------------------
// 캔버스가 아니라 DOM으로 그린다. 줄바꿈 규칙을 CSS에 맡길 수 있어서
// "단어 중간에서 잘리는" 문제를 직접 계산하지 않아도 된다.
function showBubble(text, x, y) {
  bubble.textContent = text;
  bubble.classList.add('on');
  const bw = bubble.offsetWidth;
  const bh = bubble.offsetHeight;
  // 화면 위쪽에 있을 때는 말풍선을 아래로 내린다 — 잘리지 않도록.
  const above = y - bh - 14;
  const top = above < 8 ? y + SIZE + 14 : above;
  bubble.classList.toggle('below', above < 8);
  const left = Math.min(Math.max(x + SIZE / 2 - bw / 2, 8), Math.max(W - bw - 8, 8));
  bubble.style.left = `${Math.round(left)}px`;
  bubble.style.top = `${Math.round(top)}px`;
}

// 화면 한가운데에 고정으로 띄운다. 햄스터가 돌아다니는 동안 쓰는 방식이다.
function showBubbleFixed(text) {
  bubble.textContent = text;
  bubble.classList.add('on');
  bubble.classList.remove('below');
  bubble.style.left = `${Math.round(W / 2 - bubble.offsetWidth / 2)}px`;
  bubble.style.top = `${Math.round(H / 2 - bubble.offsetHeight / 2)}px`;
}

function hideBubble() {
  bubble.classList.remove('on');
}

// --- 상태 ---------------------------------------------------------------
// 'working'  대기. 창을 작게 줄이고 우하단에 앉아 숨만 쉰다.
// 'eye'      눈운동. 화면 가장자리를 한 바퀴 돈다.
// 'stretch'  기지개. 화면 중앙에서 팔을 들어올린다.
const EYE_MS = 20000;
const FAR_MS = 10000;
const STRETCH_MS = 10000;

// 화면 가장자리를 도는 바퀴 수. 한 바퀴는 너무 느려서 눈이 거의 안 움직인다.
// 화면이 크든 작든 같은 시간에 두 바퀴를 돌므로, 큰 화면에서는 자연히 더 빨라진다.
const EYE_LAPS = 2;

// 운동 중인 상태들. 나머지는 전부 '앉아서 쳇바퀴 도는' 그림이다.
const RESTING = new Set(['working', 'prompt', 'snoozed', 'off']);
const ACTIVE = new Set(['eye', 'far', 'stretch']);

let state = 'working';
let snoozeCount = 0; // 오늘 미룬 횟수. 볼주머니 크기에 쓴다.
let phaseStart = performance.now();
let tick = 0;

function restPosition() {
  return { x: W / 2 - SIZE / 2, y: H / 2 - SIZE / 2 };
}

// 화면 가장자리를 따라가는 경로. 눈이 편하게 따라갈 수 있도록 여백을 크게 둔다.
function edgePoint(progress) {
  const m = 80;
  const w = Math.max(W - SIZE - m * 2, 1);
  const h = Math.max(H - SIZE - m * 2, 1);
  let d = (progress % 1) * (2 * (w + h));
  if (d < w) return { x: m + d, y: m };
  d -= w;
  if (d < h) return { x: m + w, y: m + d };
  d -= h;
  if (d < w) return { x: m + w - d, y: m + h };
  d -= w;
  return { x: m, y: m + h - d };
}

function setTray(name) {
  invoke('set_tray_state', { state: name }).catch(() => {});
}

function secondsLeft(elapsed, total) {
  return Math.max(Math.ceil((total - elapsed) / 1000), 0);
}

function render(now) {
  ctx.clearRect(0, 0, W, H);
  const elapsed = now - phaseStart;
  const gear = gearLayers();

  if (RESTING.has(state)) {
    const { x, y } = restPosition();
    // 햄스터가 미니 쳇바퀴 **위에서** 구른다. 물리적으로는 말이 안 되지만
    // 몸이 동그래서 뒤에 큰 바퀴를 두면 그냥 원이 겹친 것으로만 보였다.
    // 발밑에 작은 바퀴를 두고 발을 구르게 하니 굴리는 느낌이 산다.
    const bob = tick % 2 ? SCALE : 0;

    // 발밑 물건의 위쪽이 햄스터 엉덩이에 물리도록 겹쳐 둔다.
    // 완전히 아래로 떨어뜨리면 그냥 바닥에 따로 놓인 물건처럼 보인다.
    const base = allBases()[get('base')];
    if (base) {
      const baseScale = SCALE * base.scale;
      const baseSize = CELL * baseScale;
      drawLayer(
        base.layer(-tick * 0.5),
        x + (SIZE - baseSize) / 2,
        y + SIZE - SCALE * 4,
        baseScale,
      );
    }

    const cheeks = state === 'snoozed' ? [puffLayer(snoozeCount)] : [];
    const feet = tick % 2 ? FEET_A : FEET_B;
    drawSprite(IDLE, [feet, ...cheeks, ...gear], x, y + bob, false);
    return;
  }

  if (state === 'eye') {
    if (elapsed >= EYE_MS) {
      state = 'far';
      phaseStart = now;
      return;
    }
    const progress = (elapsed / EYE_MS) * EYE_LAPS;
    const { x, y } = edgePoint(progress);
    const lap = progress % 1;
    const flip = lap > 0.5 && lap < 0.75; // 왼쪽으로 갈 때는 그쪽을 보게
    drawSprite(IDLE, gear, x, y + (tick % 4 < 2 ? SCALE : 0), flip);
    // 말풍선은 따라다니지 않고 화면 한가운데 고정한다.
    // 햄스터를 따라 움직이면 읽으려고 눈이 두 번 일하게 되어 어지럽다.
    showBubbleFixed(t('eye', secondsLeft(elapsed, EYE_MS)));
    return;
  }

  // 20-20-20의 핵심. 화면 안에서 아무리 눈을 굴려도 초점 거리는 그대로라
  // 실제로 눈을 쉬게 하려면 화면 밖 먼 곳을 봐야 한다.
  if (state === 'far') {
    if (elapsed >= FAR_MS) {
      state = 'stretch';
      phaseStart = now;
      return;
    }
    const x = W / 2 - SIZE / 2;
    const y = H / 2 - SIZE / 2;
    drawSprite(IDLE, gear, x, y + (tick % 8 < 4 ? SCALE : 0), false);
    showBubble(t('far', secondsLeft(elapsed, FAR_MS)), x, y);
    return;
  }

  if (state === 'stretch') {
    if (elapsed >= STRETCH_MS) {
      state = 'working';
      phaseStart = now;
      setTray('working');
      hideBubble();
      invoke('set_stage', { full: false }).then(placePet).catch(() => {});
      applyPetVisibility();
      log(DONE).then(() => emit('stats-changed').catch(() => {}));
      scheduleNext();
      return;
    }
    const x = W / 2 - SIZE / 2;
    const y = H / 2 - SIZE / 2;
    // 팔을 올렸다 내렸다 반복 — 사용자가 따라 하기 쉬운 속도로.
    const up = tick % 16 < 8;
    drawSprite(IDLE, up ? [ARMS_UP, ...gear] : gear, x, y, false);
    showBubble(t('stretch', secondsLeft(elapsed, STRETCH_MS)), x, y);
  }
}

// rAF를 쓰지 않는 이유는 대기 중에도 초당 60번 깨워 배터리를 갉아먹기 때문이다.
const IDLE_MS = 1200;
const ACTIVE_MS = 50;

function loop() {
  const now = performance.now();
  tick++;
  render(now);
  setTimeout(loop, ACTIVE.has(state) ? ACTIVE_MS : IDLE_MS);
}
loop();

// --- 놓아둔 자리 -----------------------------------------------------------
// 놓아둔 자리는 화면 가장자리로부터의 거리로 기억한다. 모니터를 옮겨 다녀도
// 같은 자리처럼 보이고, 해상도가 다른 화면에서도 밖으로 나가지 않는다.
// 운동 중에는 화면 전체를 쓰므로 이 값과 무관하다.
function placePet() {
  return invoke('place_pet', { right: get('petRight'), bottom: get('petBottom') }).catch(() => {});
}

let moveMode = false;

async function enterMoveMode() {
  if (moveMode) return;
  moveMode = true;

  // 옮기는 동안에는 햄스터가 제자리에 있어야 한다.
  if (ACTIVE.has(state)) return;

  moverHint.textContent = t('moveHint');
  moverDone.textContent = t('moveDone');
  mover.classList.add('on');
  await invoke('set_pet_visible', { show: true }).catch(() => {});
  // 끌 수 있으려면 클릭이 통과하지 않아야 한다.
  await invoke('set_click_through', { ignore: false }).catch(() => {});
}

async function leaveMoveMode() {
  moveMode = false;
  mover.classList.remove('on');
  const [right, bottom] = await invoke('get_pet_offset').catch(() => [null, null]);
  if (Number.isFinite(right) && Number.isFinite(bottom)) {
    set('petRight', Math.round(right));
    set('petBottom', Math.round(bottom));
  }
  await invoke('set_click_through', { ignore: true }).catch(() => {});
  applyPetVisibility();
}

moverDone.addEventListener('click', leaveMoveMode);
listen('move-mode', enterMoveMode);

// 평소에 바탕화면에 둘지는 설정을 따르지만, 운동 중에는 무조건 보여야 한다.
// 눈운동은 햄스터를 눈으로 따라가는 것이라 햄스터가 없으면 성립하지 않는다.
function applyPetVisibility() {
  const show = ACTIVE.has(state) || get('showPet');
  invoke('set_pet_visible', { show }).catch(() => {});
}

// --- 알림 흐름 -----------------------------------------------------------
// 주기가 되면 곧장 운동을 시키지 않고 먼저 묻는다. 무시할 자유를 주되 그 횟수를 남기는 게
// 이 앱의 성격이다. 미루기가 3번 쌓이면 앱이 먼저 물러난다 — 사용자가 앱을 이기게 두되
// 기록에는 남긴다.
const SNOOZE_MS = 15 * 60 * 1000;
const SNOOZE_LIMIT = 3;

// 알림을 띄우고 이만큼 기다려도 아무 버튼도 안 누르면 무시로 본다.
// 5분: 회의 중이거나 잠깐 자리를 비운 경우까지 살린다.
// 2분으로 잡았다가 늘렸다 — 짧으면 '자리에 없었을 뿐'인 사람이 무시로 기록된다.
const IGNORE_MS = 5 * 60 * 1000;

// 연달아 이만큼 무시되면 알림을 멈춘다. 반응이 없는데 계속 띄우는 건
// 잔소리일 뿐이고, 자리를 비운 것이라면 기록만 더럽힌다.
const IGNORE_STREAK_LIMIT = 3;

// 이만큼 아무 입력이 없으면 자리에 없다고 본다.
// 자리에 없는 사람에게 알림을 띄우면 돌아왔을 때 낡은 알림이 떠 있고,
// 그 시간이 전부 '무시함'으로 기록돼 응답률이 거짓이 된다.
const AWAY_SEC = 180;

async function isAway() {
  const seconds = await invoke('idle_seconds').catch(() => 0);
  return seconds >= AWAY_SEC;
}

let ignoreStreak = 0;
let ignoreTimer = 0;

async function openPrompt() {
  if (state !== 'working') return;
  if (await isOffToday()) return; // 오늘은 그만하기로 한 날

  // 자리에 없으면 묻지 않는다. 어차피 화면을 안 보고 있으니 눈도 쉬는 중이다.
  // 다음 주기에 다시 확인한다 — 돌아오면 그때부터 새로 센다.
  if (await isAway()) {
    scheduleNext();
    return;
  }

  const snoozes = await todayCount(SNOOZE);
  snoozeCount = snoozes;
  state = 'prompt';
  setTray(snoozes > 0 ? 'puff' : 'working');
  await emit('prompt-show', {
    kind: snoozes >= SNOOZE_LIMIT ? 'stop' : 'ask',
    snoozes,
  }).catch(() => {});
  invoke('show_prompt', { anchor: null }).catch(() => {});

  // 응답이 없으면 스스로 닫는다. 이게 없으면 알림을 무시했을 때 앱이
  // prompt 상태에 영원히 멈춰 다음 알림이 아예 오지 않는다.
  clearTimeout(ignoreTimer);
  ignoreTimer = setTimeout(handleIgnored, IGNORE_MS);
}

async function handleIgnored() {
  if (state !== 'prompt') return;
  closePrompt();
  state = 'working';

  // 뜬 뒤에 자리를 뜬 경우다. 무시한 게 아니므로 기록하지 않는다.
  if (await isAway()) {
    scheduleNext();
    return;
  }

  await log(IGNORED);
  emit('stats-changed').catch(() => {});
  ignoreStreak += 1;

  if (ignoreStreak >= IGNORE_STREAK_LIMIT) {
    // 앱이 먼저 물러난다. 기록은 남기되 더는 말 걸지 않는다.
    // 다시 시작하려면 메뉴바에서 '지금 운동하기'를 고르면 된다.
    state = 'off';
    setTray('sleep');
    clearTimeout(nextTimer);
    applyPetVisibility();
    return;
  }

  // 무시한 사람에게 15분 만에 다시 묻는 건 재촉이다. 다음 주기까지 그냥 기다린다.
  scheduleNext();
}

function closePrompt() {
  clearTimeout(ignoreTimer);
  ignoreStreak = 0; // 반응이 있었으므로 연속 무시가 끊긴다
  invoke('hide_prompt').catch(() => {});
}

listen('debug-prompt', openPrompt);

listen('prompt-accept', () => {
  closePrompt();
  state = 'working'; // startExercise가 working에서만 출발하므로 되돌려 놓는다
  startExercise();
});

listen('prompt-snooze', async () => {
  closePrompt();
  await log(SNOOZE);
  emit('stats-changed').catch(() => {});
  snoozeCount = await todayCount(SNOOZE);
  state = 'snoozed';
  setTray('puff');
  applyPetVisibility();
  clearTimeout(nextTimer);
  nextTimer = setTimeout(() => {
    state = 'working';
    openPrompt();
  }, SNOOZE_MS);
});

listen('prompt-off', async () => {
  closePrompt();
  await log(OFF);
  state = 'off';
  setTray('sleep');
  clearTimeout(nextTimer);
  applyPetVisibility();
});

listen('prompt-keep', () => {
  closePrompt();
  state = 'working';
  scheduleNext();
});

async function startExercise() {
  if (state !== 'working') return;
  setTray('exercise');
  clearTimeout(nextTimer);

  // 숨겨져 있었다면 먼저 나타나야 한다.
  await invoke('set_pet_visible', { show: true }).catch(() => {});
  // 화면을 도는 동안에만 창을 전체 화면으로 넓힌다. 리사이즈가 반영될 시간을 준다.
  await invoke('set_stage', { full: true }).catch(() => {});
  setTimeout(() => {
    resize();
    state = 'eye';
    phaseStart = performance.now();
  }, 150);
}

// 주기 타이머. 설정에서 주기를 바꾸면 남은 시간을 버리고 새 주기로 다시 잡는다.
let nextTimer = 0;

function scheduleNext() {
  clearTimeout(nextTimer);
  const ms = get('intervalMin') * 60 * 1000;
  nextTimer = setTimeout(openPrompt, ms);
}

listen('start-exercise', () => {
  // 메뉴바에서 직접 부른 것이므로 미루는 중이거나 오늘 그만인 상태에서도 시작한다.
  closePrompt();
  clearTimeout(nextTimer);
  state = 'working';
  startExercise();
});

// 메뉴바 문구는 펫 창이 밀어넣는다. 문구의 정본은 i18n.js 하나뿐이다.
function pushTrayLabels() {
  document.documentElement.lang = getLang();
  invoke('set_tray_labels', {
    start: t('trayStart'),
    movePet: t('trayMove'),
    dashboard: t('trayDashboard'),
    settings: t('traySettings'),
    quit: t('trayQuit'),
  }).catch(() => {});
}

// 설정 창에서 뭔가 바뀌면 알려온다. 이미 떠 있는 창은 저장소가 바뀐 걸 스스로 알 수 없다.
listen('settings-changed', async () => {
  pushFollowCursor();
  await refreshPacks();
  refreshLang();
  applyTheme();
  pushTrayLabels();
  applyPetVisibility();
  if (state === 'working') scheduleNext();
});

// 화면을 고르는 판단은 Rust에 있는데 설정은 localStorage에 있다. 창 셋(펫·알림·운동)이
// 같은 기준을 쓰려면 이 값을 Rust로 밀어넣어야 한다.
function pushFollowCursor() {
  invoke('set_follow_cursor', { on: get('followCursor') }).catch(() => {});
}

pushFollowCursor();
await refreshPacks();
applyTheme();
pushTrayLabels();
applyPetVisibility();
placePet();
scheduleNext();

// 마우스가 다른 화면으로 넘어갔다. 따라갈지는 설정이 정한다.
listen('monitor-changed', () => {
  if (get('followCursor') && RESTING.has(state)) placePet();
});
