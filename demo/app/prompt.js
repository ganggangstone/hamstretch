// 알림 창. 두 종류를 같은 창으로 돌려 쓴다.
//
//  ask  — "운동할까요?"           [지금 하기] [15분 미루기]
//  stop — "오늘은 그만 알릴까요?"  [오늘 그만] [계속 알리기]
//
// 어느 쪽을 보여줄지는 펫 창이 정해서 이벤트로 알려준다.
// 이 창은 화면만 담당하고 상태를 갖지 않는다 — 상태가 두 곳에 있으면 갈라진다.

import { PAL, CELL, IDLE, puffLayer } from './sprites.js';
import { gearLayers } from './outfit.js';
import { refreshPacks } from './packs.js';
import { t, refreshLang } from './i18n.js';
import { applyTheme } from './theme.js';

const { emit, listen } = window.__TAURI__.event;

const canvas = document.getElementById('face');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const primary = document.getElementById('primary');
const secondary = document.getElementById('secondary');

const SCALE = 3;

function drawFace(snoozes) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < CELL; row++) {
    const line = (IDLE[row] || '').padEnd(CELL, '.');
    for (let col = 0; col < CELL; col++) {
      const color = PAL[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }

  // 볼주머니가 먼저, 소품이 그 위에.
  const layers = [puffLayer(snoozes), ...gearLayers()];
  for (const layer of layers) {
    for (const [col, row, key] of layer) {
      const color = PAL[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }
}

let kind = 'ask';

function paint(snoozes) {
  applyTheme();
  drawFace(snoozes);
  if (kind === 'stop') {
    message.textContent = t('promptStop');
    primary.textContent = t('promptOffToday');
    secondary.textContent = t('promptKeepGoing');
  } else {
    message.textContent = snoozes > 0 ? t('promptAgain', snoozes) : t('promptAsk');
    primary.textContent = t('promptNow');
    secondary.textContent = t('promptSnooze');
  }
}

primary.addEventListener('click', () => {
  emit(kind === 'stop' ? 'prompt-off' : 'prompt-accept').catch(() => {});
});

secondary.addEventListener('click', () => {
  emit(kind === 'stop' ? 'prompt-keep' : 'prompt-snooze').catch(() => {});
});

// 펫 창이 "이런 내용으로 띄워라"라고 알려준다.
listen('prompt-show', (event) => {
  refreshLang();
  kind = event.payload?.kind ?? 'ask';
  paint(event.payload?.snoozes ?? 0);
});

listen('settings-changed', () => {
  refreshLang();
  paint(0);
});

await refreshPacks();
paint(0);
