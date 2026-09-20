// 설정값 저장소. 창 여러 개가 같은 localStorage를 공유한다.
//
// 새 설정을 추가할 때는 여기에 항목 하나만 늘린다.
// 값을 읽는 쪽이 기본값을 각자 정하면 반드시 갈라지므로 기본값도 여기서만 정한다.

const DEFS = {
  // 평소(대기 중)에 바탕화면에 햄스터를 띄울지.
  // 꺼도 운동할 때는 나타난다 — 눈운동은 햄스터를 눈으로 따라가는 것이라
  // 햄스터가 없으면 성립하지 않기 때문이다.
  showPet: { def: true, parse: (v) => v === 'true' },

  // 마우스가 있는 화면으로 햄스터를 따라 보낼지.
  // 모니터가 여러 대일 때 주 모니터에만 뜨면 정작 일하는 화면에는 아무것도 안 보인다.
  followCursor: { def: true, parse: (v) => v === 'true' },

  // 놓아둔 자리. 절대 좌표가 아니라 화면 오른쪽·아래 가장자리로부터의 거리다 —
  // 그래야 다른 모니터로 옮겨가도 같은 자리처럼 보인다.
  petRight: { def: 40, parse: (v) => Number(v) },
  petBottom: { def: 40, parse: (v) => Number(v) },

  // 운동 주기(분).
  intervalMin: { def: 20, parse: (v) => Number(v) },

  // 착용 중인 소품 목록. 꾸러미를 불러오면 항목이 늘어나므로 설정 키를 하나씩
  // 만들지 않고 목록 하나로 둔다.
  worn: { def: '["glasses"]', parse: (v) => v },

  // 대기 중 발밑에 무엇을 놓을지. 'none'이면 아무것도 안 그린다
  // — 움직이는 게 거슬리는 사람이 있다.
  base: { def: 'wheel', parse: (v) => v },

  // 목표 응답률(%). "쉬라고 알린 것 중 몇 %를 실제로 했나".
  //
  // 절대 횟수(주 25회 등)를 쓰지 않는 이유: 근무 시간이 일정하지 않으면
  // 목표가 행동이 아니라 '컴퓨터 앞에 앉은 시간'을 재게 된다.
  // 오래 앉을수록 점수가 오르는 건 이 앱이 하려는 것과 정반대다.
  goalRate: { def: 80, parse: (v) => Number(v) },
};

export const INTERVAL_CHOICES = [10, 20, 30, 45, 60];

export function get(key) {
  const spec = DEFS[key];
  if (!spec) throw new Error(`알 수 없는 설정: ${key}`);
  const raw = localStorage.getItem(key);
  if (raw === null) return spec.def;
  const parsed = spec.parse(raw);
  return Number.isNaN(parsed) ? spec.def : parsed;
}

export function set(key, value) {
  if (!DEFS[key]) throw new Error(`알 수 없는 설정: ${key}`);
  localStorage.setItem(key, String(value));
}

/// 착용 중인 소품 id 목록.
export function getWorn() {
  try {
    const list = JSON.parse(get('worn'));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function setWorn(list) {
  set('worn', JSON.stringify(list));
}

export function toggleWorn(id, on) {
  const list = getWorn().filter((x) => x !== id);
  if (on) list.push(id);
  setWorn(list);
}
