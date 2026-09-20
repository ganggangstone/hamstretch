// 설정 창. 언어·화면 모드·운동 주기·바탕화면 표시, 그리고 피드백 보내기.
//
// 저장은 localStorage. 펫 창과 설정 창은 같은 출처라 저장소를 공유하지만,
// 이미 떠 있는 창은 저장소가 바뀐 걸 스스로 모르므로 settings-changed 이벤트로 알린다.

import { t, getLang, setLang, LANGS } from './i18n.js';
import { applyTheme, getTheme, setTheme, THEMES } from './theme.js';
import { get, set, getWorn, toggleWorn, INTERVAL_CHOICES } from './settings-store.js';
import { allAccessories, allBases } from './outfit.js';
import { refreshPacks, packs } from './packs.js';
import { send, context, cooldownLeftMs, FEEDBACK_URL, MAX_LENGTH } from './feedback.js';

const { emit, listen } = window.__TAURI__.event;
const { invoke } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const { getCurrentWebview } = window.__TAURI__.webview;
const { getCurrentWindow } = window.__TAURI__.window;

const el = (id) => document.getElementById(id);
const langSelect = el('lang');
const themeSelect = el('theme');
const intervalSelect = el('interval');
const showPetCheck = el('showPet');
const followCheck = el('followCursor');
const baseSelect = el('base');
const fbMessage = el('fbMessage');
const fbEmail = el('fbEmail');
const fbStatus = el('fbStatus');
const fbSend = el('fbSend');

// 소품 줄은 목록에서 만든다. 소품이 늘 때마다 HTML을 손으로 늘리면
// 언젠가 하나를 빠뜨리고, 그 소품은 영영 켤 수 없게 된다.
function label(item) {
  return item?.name?.[getLang()] ?? item?.name?.en ?? '';
}

// 소품 줄은 카탈로그에서 만든다. 꾸러미를 불러오면 항목이 늘어나므로
// HTML을 손으로 늘리는 방식으로는 감당이 안 된다.
function paintGear() {
  const box = el('gear');
  box.innerHTML = '';
  const worn = getWorn();

  for (const [id, item] of Object.entries(allAccessories())) {
    const row = document.createElement('label');
    row.className = 'row';

    const name = document.createElement('span');
    name.textContent = label(item);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = worn.includes(id);
    check.addEventListener('change', () => {
      toggleWorn(id, check.checked);
      announce();
    });

    row.append(name, check);
    box.append(row);
  }
}

// 불러온 꾸러미 목록. 지우기도 여기서 한다.
function paintPacks() {
  const box = el('packs');
  box.innerHTML = '';
  const list = packs();

  if (!list.length) {
    box.innerHTML = `<p class="help">${t('packsEmpty')}</p>`;
    return;
  }
  for (const pack of list) {
    const row = document.createElement('div');
    row.className = 'row';

    const name = document.createElement('span');
    name.textContent = label(pack);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'link';
    remove.textContent = t('packRemove');
    remove.addEventListener('click', async () => {
      await invoke('remove_pack', { id: pack.id }).catch(() => {});
      await refreshPacks();
      paintPacks();
      el('gearTitle').textContent = t('gearTitle');
  el('packsTitle').textContent = t('packsTitle');
  el('packImport').textContent = t('packImport');
  el('packDrop').textContent = t('packDrop');
  paintGear();
  paintPacks();
      announce();
    });

    row.append(name, remove);
    box.append(row);
  }
}

function fillOptions(select, values, labelFor) {
  select.innerHTML = '';
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = labelFor(value);
    select.append(option);
  }
}

// 화면의 모든 문구를 다시 칠한다. 언어를 바꾸면 이 함수만 다시 부르면 된다.
function paint() {
  document.documentElement.lang = getLang();
  document.title = t('settingsTitle');
  getCurrentWindow().setTitle(t('settingsTitle')).catch(() => {});
  el('title').textContent = t('settingsTitle');
  el('langLabel').textContent = t('language');
  el('themeLabel').textContent = t('theme');
  el('intervalLabel').textContent = t('interval');
  el('showPetLabel').textContent = t('showPet');
  el('showPetHelp').textContent = t('showPetHelp');
  el('followLabel').textContent = t('followCursor');
  el('followHelp').textContent = t('followCursorHelp');
  el('baseLabel').textContent = t('base');
  const catalog = allBases();
  fillOptions(baseSelect, ['none', ...Object.keys(catalog)], (id) =>
    id === 'none' ? t('baseNone') : label(catalog[id]));
  baseSelect.value = get('base');
  el('gearTitle').textContent = t('gearTitle');
  el('packsTitle').textContent = t('packsTitle');
  el('packImport').textContent = t('packImport');
  el('packDrop').textContent = t('packDrop');
  paintGear();
  paintPacks();
  el('note').textContent = t('settingsNote');

  el('feedbackTitle').textContent = t('feedback');
  fbMessage.placeholder = t('feedbackPlaceholder');
  fbMessage.maxLength = MAX_LENGTH;
  fbEmail.placeholder = t('feedbackEmail');
  fbSend.textContent = t('feedbackSend');
  // 무엇이 함께 전송되는지 숨기지 않고 그대로 보여준다.
  el('fbSends').textContent = t('feedbackSends', Object.values(context()).join(' · '));

  fillOptions(langSelect, LANGS, (v) => t(`lang_${v}`));
  fillOptions(themeSelect, THEMES, (v) => t(`theme_${v}`));
  fillOptions(intervalSelect, INTERVAL_CHOICES, (v) => t('minutes', v));

  langSelect.value = getLang();
  themeSelect.value = getTheme();
  intervalSelect.value = String(get('intervalMin'));
  showPetCheck.checked = get('showPet');
  followCheck.checked = get('followCursor');
}

function announce() {
  emit('settings-changed').catch(() => {});
}

langSelect.addEventListener('change', () => {
  setLang(langSelect.value);
  paint();
  announce();
});

themeSelect.addEventListener('change', () => {
  setTheme(themeSelect.value);
  applyTheme();
  announce();
});

intervalSelect.addEventListener('change', () => {
  set('intervalMin', Number(intervalSelect.value));
  announce();
});

showPetCheck.addEventListener('change', () => {
  set('showPet', showPetCheck.checked);
  announce();
});

followCheck.addEventListener('change', () => {
  set('followCursor', followCheck.checked);
  announce();
});

baseSelect.addEventListener('change', () => {
  set('base', baseSelect.value);
  announce();
});

fbSend.addEventListener('click', async () => {
  fbStatus.textContent = '';
  try {
    await send({ message: fbMessage.value, email: fbEmail.value });
    fbMessage.value = '';
    fbStatus.textContent = t('feedbackSent');
  } catch (error) {
    const reason = String(error.message || error);
    if (reason === 'NOT_CONFIGURED') fbStatus.textContent = t('feedbackOff');
    else if (reason === 'EMPTY') fbStatus.textContent = t('feedbackEmpty');
    else if (reason === 'COOLDOWN')
      fbStatus.textContent = t('feedbackCooldown', Math.ceil(cooldownLeftMs() / 1000));
    else fbStatus.textContent = t('feedbackFailed');
  }
});

// 아직 보낼 곳이 없으면 왜 안 되는지 미리 알려준다 — 눌러보고 나서 알게 하지 않는다.
if (!FEEDBACK_URL) {
  fbSend.disabled = true;
  fbStatus.textContent = t('feedbackOff');
}

// 불러오기는 한 곳으로 모은다. 버튼으로 고르든 끌어다 놓든 같은 일을 한다.
async function importPack(path) {
  const status = el('packStatus');
  try {
    const id = await invoke('import_pack', { path });
    await refreshPacks();

    // **불러오면 바로 입힌다.** 체크박스를 따로 켜게 하면
    // "샀는데 아무 일도 안 일어난다"가 된다.
    const pack = packs().find((p) => p.id === id);
    for (const name of Object.keys(pack?.accessories ?? {})) toggleWorn(`${id}:${name}`, true);

    paintPacks();
    paintGear();
    status.textContent = t('packAdded', label(pack));
    announce();
  } catch (error) {
    const reason = String(error);
    // 왜 안 됐는지 알려준다. "안 됩니다"만 뜨면 문의가 온다.
    if (reason.includes('TOO_NEW')) status.textContent = t('packTooNew');
    else if (reason.includes('NOT_JSON') || reason.includes('NO_FORMAT') || reason.includes('BAD_ID'))
      status.textContent = t('packBad');
    else status.textContent = t('packFailed');
  }
}

el('packImport').addEventListener('click', async () => {
  const picked = await open({
    multiple: false,
    filters: [{ name: t('packsTitle'), extensions: ['hamsterpack', 'json'] }],
  }).catch(() => null);
  if (picked) importPack(picked);
});

// 창에 파일을 끌어다 놓아도 된다. 비개발자에게는 파일 선택 창을 헤매는 것보다 쉽다.
const dropZone = document.body;
getCurrentWebview()
  .onDragDropEvent((event) => {
    if (event.payload.type === 'over') {
      dropZone.classList.add('dropping');
    } else if (event.payload.type === 'drop') {
      dropZone.classList.remove('dropping');
      const file = event.payload.paths?.[0];
      if (file) importPack(file);
    } else {
      dropZone.classList.remove('dropping');
    }
  })
  .catch(() => {});

// 파일을 더블클릭해서 앱을 연 경우
listen('open-packs', (event) => {
  for (const path of event.payload ?? []) importPack(path);
});

await refreshPacks();
applyTheme();
paint();
