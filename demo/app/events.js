// 사건 기록. 파일에는 한 줄에 하나씩 원본만 쌓고, 숫자는 읽을 때 계산한다.
//
// "오늘 몇 번 미뤘나" 같은 값을 따로 저장하지 않는 이유:
// 저장한 값과 원본은 반드시 어긋나고(앱이 중간에 꺼지면 특히), 나중에 기준을 바꾸면
// 과거 데이터를 다시 계산할 수 없게 된다.

const { invoke } = window.__TAURI__.core;

export const DONE = 'done';
export const SNOOZE = 'snooze';
export const OFF = 'off';
// 알림을 띄웠는데 아무 버튼도 누르지 않은 경우. 미루기와 구분해서 남긴다 —
// 적극적으로 미룬 것과 반응조차 없는 것은 사용자 상태가 전혀 다르고,
// 후자가 쌓이면 알림 방식 자체가 안 맞는다는 신호다.
export const IGNORED = 'ignored';

// 응답률의 분모. "쉬라는 신호를 받은 횟수"다.
// 'off'를 빼면 세 번 미루고 그만 누르는 게 최고 점수가 되어버리므로 반드시 포함한다.
export const PROMPTED = [DONE, SNOOZE, OFF, IGNORED];

export async function log(kind) {
  await invoke('append_event', { kind }).catch(() => {});
}

export async function all() {
  const text = await invoke('read_events').catch(() => '');
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        // 쓰다가 앱이 꺼져 줄이 깨졌을 수 있다. 그 줄만 버리고 나머지는 살린다.
        return null;
      }
    })
    .filter(Boolean);
}

// 날짜 경계는 사용자 OS의 시간대를 그대로 따른다.
function isToday(millis) {
  const then = new Date(millis);
  const now = new Date();
  return (
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate()
  );
}

export async function todayCount(kind) {
  const events = await all();
  return events.filter((e) => e.type === kind && isToday(e.t)).length;
}

/// 오늘 이미 "그만 알리기"를 눌렀는지. 앱을 껐다 켜도 유지돼야 한다.
export async function isOffToday() {
  return (await todayCount(OFF)) > 0;
}

/// 이번 주(월요일 시작)의 요일별 개수. 화면에 막대로 그리려고 쓴다.
/// 주의 시작을 월요일로 고정한 이유: 근무 주간이 기준이라 일요일 시작이 어색하다.
export function weekStart(now = new Date()) {
  const start = new Date(now);
  const weekday = (start.getDay() + 6) % 7; // 월=0 … 일=6
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - weekday);
  return start;
}

export async function thisWeekByDay(kind) {
  const events = await all();
  const start = weekStart();
  const days = new Array(7).fill(0);

  for (const event of events) {
    if (event.type !== kind) continue;
    const day = Math.floor((new Date(event.t) - start) / 86400000);
    if (day >= 0 && day < 7) days[day] += 1;
  }
  return days;
}

/// 이번 주 종류별 개수. 응답률은 이 값으로 계산한다.
export async function thisWeekCounts() {
  const events = await all();
  const start = weekStart().getTime();
  const counts = { done: 0, snooze: 0, off: 0, ignored: 0 };

  for (const event of events) {
    if (event.t < start) continue;
    if (event.type in counts) counts[event.type] += 1;
  }
  return counts;
}

/// 응답률(0~1). 분모가 0이면 null — "아직 판단할 수 없음"과 0%는 다르다.
export function responseRate(counts) {
  const total = PROMPTED.reduce((sum, kind) => sum + (counts[kind] ?? 0), 0);
  return total === 0 ? null : counts.done / total;
}

export function promptedTotal(counts) {
  return PROMPTED.reduce((sum, kind) => sum + (counts[kind] ?? 0), 0);
}
