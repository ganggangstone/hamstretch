// 지금 무엇을 입고 있는지 계산한다.
//
// sprites.js는 그림 데이터만 갖고 설정을 모른다 — 그래야 node에서 도는
// 미리보기·검사 도구가 브라우저 저장소 없이도 그 파일을 읽을 수 있다.
// 설정과 그림을 잇는 일은 이 파일이 맡는다.
//
// 아직 공개하지 않은 소품은 애초에 sprites.js에 없다(tools/marketing/unreleased.js).
// 앱에서 숨기는 게 아니라 빌드에 넣지 않는 것이라, 배포 파일을 뜯어도 나오지 않는다.

import { ACCESSORIES, BASES } from './sprites.js';
import { get, getWorn } from './settings-store.js';
import { packAccessories, packBases } from './packs.js';

// 앱에 들어 있는 것 + 불러온 꾸러미. 꾸러미 소품은 "꾸러미id:소품id" 꼴로 구분한다.
export function allAccessories() {
  return { glasses: ACCESSORIES.glasses, ...packAccessories() };
}

export function allBases() {
  return { ...BASES, ...packBases() };
}

export function gearLayers() {
  const catalog = allAccessories();
  return getWorn()
    .map((id) => catalog[id]?.layer)
    .filter(Boolean);
}
