// 불러온 소품 꾸러미.
//
// 소품을 앱에 넣지 않고 파일로 받는 이유: 새 소품을 낼 때 앱을 업데이트하지 않아도 된다.
// 서명이 없는 이 앱에서는 업데이트할 때마다 사용자가 우클릭 → 열기를 다시 해야 하므로
// 업데이트 자체가 비싼 행위다.
//
// 파일 포맷(format: 1)
// {
//   "format": 1,
//   "id": "winter",                       // 영문·숫자·하이픈만
//   "name": { "ko": "겨울 세트", "en": "Winter Set" },
//   "accessories": { "santa": { "name": {...}, "layer": [[x, y, "색키"], ...] } },
//   "bases":       { "snowman": { "name": {...}, "scale": 0.7, "layer": [[x, y, "색키"], ...] } }
// }
//
// 포맷을 바꿀 때는 format 번호를 올리고, 앱은 옛 번호도 계속 읽어야 한다.
// 한 번 판 파일은 영원히 열려야 하기 때문이다.

const { invoke } = window.__TAURI__.core;

let loaded = [];

export async function refreshPacks() {
  loaded = await invoke('list_packs').catch(() => []);
  return loaded;
}

export function packs() {
  return loaded;
}

/// 꾸러미들이 가져온 소품을 하나로 합친다. 같은 이름이면 나중 것이 이긴다.
export function packAccessories() {
  const all = {};
  for (const pack of loaded) {
    for (const [id, item] of Object.entries(pack.accessories ?? {})) {
      all[`${pack.id}:${id}`] = item;
    }
  }
  return all;
}

export function packBases() {
  const all = {};
  for (const pack of loaded) {
    for (const [id, item] of Object.entries(pack.bases ?? {})) {
      all[`${pack.id}:${id}`] = item;
    }
  }
  return all;
}
