// 대시보드. 지금까지 쌓인 기록을 보여준다.
//
// 저장된 숫자는 없다 — events.jsonl의 원본을 매번 세서 그린다.
// 기록이 아주 많아져도 이 규모(하루 수십 줄)에서는 문제가 되지 않는다.

import { PAL, CELL, IDLE, puffLayer } from './sprites.js';
import { gearLayers } from './outfit.js';
import { refreshPacks } from './packs.js';
import { t, refreshLang, getLang } from './i18n.js';
import { applyTheme } from './theme.js';
import { get } from './settings-store.js';
import {
  todayCount, thisWeekByDay, thisWeekCounts, responseRate, promptedTotal, DONE, SNOOZE,
} from './events.js';

const { listen } = window.__TAURI__.event;
const { getCurrentWindow } = window.__TAURI__.window;

const el = (id) => document.getElementById(id);
const ctx = el('face').getContext('2d');
const SCALE = 4;
const MIN_SAMPLE = 5; // 이보다 적으면 비율을 판단 근거로 쓰지 않는다

function drawFace(snoozes) {
  ctx.clearRect(0, 0, CELL * SCALE, CELL * SCALE);
  for (let row = 0; row < CELL; row++) {
    const line = (IDLE[row] || '').padEnd(CELL, '.');
    for (let col = 0; col < CELL; col++) {
      const color = PAL[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }
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

function drawChart(byDay) {
  const chart = el('chart');
  chart.innerHTML = '';
  const max = Math.max(...byDay, 1);
  const todayIndex = (new Date().getDay() + 6) % 7; // 월=0

  byDay.forEach((count, index) => {
    const day = document.createElement('div');
    day.className = index === todayIndex ? 'day today' : 'day';

    const col = document.createElement('div');
    col.className = 'col';
    // 0회인 날도 얇은 선으로 남겨 둔다 — 칸이 비면 그날이 없는 것처럼 보인다.
    col.style.height = `${Math.round((count / max) * 100)}%`;

    const label = document.createElement('span');
    label.textContent = t('weekdays')[index];

    day.append(col, label);
    chart.append(day);
  });
}

async function refresh() {
  refreshLang();
  applyTheme();
  document.documentElement.lang = getLang();

  const [done, snoozes, weekDone, week] = await Promise.all([
    todayCount(DONE),
    todayCount(SNOOZE),
    thisWeekByDay(DONE),
    thisWeekCounts(),
  ]);

  const rate = responseRate(week);
  const total = promptedTotal(week);
  const goal = get('goalRate');
  // 표본이 적으면 비율이 요동친다(2번 중 2번 = 100%). 숫자를 믿게 하지 않는다.
  const enough = total >= MIN_SAMPLE;

  document.title = t('dashboardTitle');
  // 창 제목 표시줄은 document.title로는 안 바뀐다. 창에 직접 알려줘야 한다.
  getCurrentWindow().setTitle(t('dashboardTitle')).catch(() => {});
  el('title').textContent = t('dashboardTitle');
  el('todayDoneLabel').textContent = t('todayDone');
  el('todaySnoozeLabel').textContent = t('todaySnooze');
  el('weekLabel').textContent = t('thisWeek');
  el('todayDone').textContent = String(done);
  el('todaySnooze').textContent = String(snoozes);

  const percent = rate === null ? 0 : Math.round(rate * 100);
  el('weekCount').textContent =
    rate === null ? '—' : `${week.done} / ${total} · ${percent}%`;
  el('bar').style.width = `${Math.min(percent, 100)}%`;
  el('bar').classList.toggle('met', enough && percent >= goal);

  el('summary').textContent = snoozes > 0 ? t('summarySnoozed', snoozes) : t('summaryFine');

  if (!enough) el('goalNote').textContent = t('tooEarly', MIN_SAMPLE);
  else if (percent >= goal) el('goalNote').textContent = t('goalMet');
  else el('goalNote').textContent = t('goalShort', goal - percent);

  // 무시가 쌓이면 알림 방식이 안 맞는다는 신호다. 있을 때만 보여준다.
  el('ignored').textContent = week.ignored > 0 ? t('ignoredNote', week.ignored) : '';

  // 기록이 하나도 없으면 빈 화면 대신 무엇을 하면 되는지 알려준다.
  el('empty').textContent = total === 0 ? t('noData') : '';

  drawFace(snoozes);
  drawChart(weekDone);
}

// 창이 다시 보일 때마다 새로 읽는다. 열어둔 채로 두면 값이 낡기 때문이다.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});
listen('settings-changed', refresh);
listen('stats-changed', refresh);

await refreshPacks();
refresh();
