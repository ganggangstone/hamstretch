// 언어별 문구. 언어를 추가하려면 STRINGS에 키를 하나 더 넣으면 된다.
// 문구를 코드에 직접 쓰지 않고 전부 여기를 거치게 하는 게 규칙이다.
// 그래야 새 언어를 넣을 때 고칠 곳이 이 파일 하나로 끝난다.
const STRINGS = {
  ko: {
    eye: (n) => `햄스터를 따라 눈을 움직여요 · ${n}초`,
    far: (n) => `창밖이나 먼 곳을 봐주세요 · ${n}초`,
    stretch: (n) => `나를 따라 기지개! · ${n}초`,
    done: '잘했어요! 다음에 또 만나요',

    trayStart: '지금 운동하기',
    traySettings: '설정',
    trayQuit: '종료',

    moveHint: '끌어서 옮긴 뒤 눌러주세요',
    moveDone: '여기에 두기',
    settingsTitle: '설정',
    language: '언어',
    theme: '화면 모드',
    settingsNote: '설정은 바로 저장돼요.',
    lang_ko: '한국어',
    lang_en: 'English',
    theme_system: '시스템 설정 따르기',
    theme_light: '라이트',
    theme_dark: '다크',

    showPet: '평소에 바탕화면에 두기',
    showPetHelp: '꺼도 운동할 때는 잠깐 나타나요.',
    followCursor: '마우스 있는 화면으로 따라오기',
    followCursorHelp: '모니터를 여러 대 쓸 때, 지금 보고 있는 화면에 나타나요.',
    gearTitle: '소품',
    packsTitle: '소품 꾸러미',
    packsEmpty: '아직 불러온 꾸러미가 없어요.',
    packImport: '파일 불러오기',
    packRemove: '지우기',
    packAdded: (name) => `${name}을(를) 불러와서 바로 입혔어요!`,
    packDrop: '여기에 파일을 끌어다 놓아도 돼요.',
    packBad: '소품 꾸러미 파일이 아닌 것 같아요.',
    packTooNew: '앱이 오래됐어요. 새 버전에서 열 수 있어요.',
    packFailed: '불러오지 못했어요.',
    base: '발밑에',
    baseNone: '아무것도 없음',
    interval: '운동 주기',
    minutes: (n) => `${n}분마다`,

    feedback: '피드백 보내기',
    feedbackPlaceholder: '불편한 점이나 있으면 좋겠는 기능을 적어주세요.',
    feedbackEmail: '답장받을 이메일 (선택)',
    feedbackSends: (list) => `함께 보내는 정보: ${list}`,
    feedbackSend: '보내기',
    feedbackSent: '보냈어요. 고마워요!',
    feedbackEmpty: '내용을 적어주세요.',
    feedbackCooldown: (s) => `${s}초 뒤에 다시 보낼 수 있어요.`,
    feedbackFailed: '보내지 못했어요. 잠시 뒤 다시 시도해주세요.',
    feedbackOff: '아직 연결되지 않았어요 (개발 중).',

    promptAsk: '잠깐 쉴까요? 30초면 돼요.',
    promptAgain: (n) => `또 미뤘네요. 볼이 ${n}칸 찼어요.`,
    promptNow: '지금 하기',
    promptSnooze: '15분 미루기',
    promptStop: '오늘은 그만 알릴까요?',
    promptOffToday: '오늘 그만',
    promptKeepGoing: '계속 알리기',

    trayMove: '위치 옮기기',
    trayDashboard: '기록 보기',
    dashboardTitle: '나의 기록',
    todayDone: '오늘 한 횟수',
    todaySnooze: '오늘 미룬 횟수',
    thisWeek: '이번 주 응답률',
    weekdays: ['월', '화', '수', '목', '금', '토', '일'],
    summaryFine: '오늘은 미룬 적이 없어요.',
    summarySnoozed: (n) => `오늘 ${n}번 미뤘어요.`,
    goalMet: '이번 주 목표를 채웠어요!',
    goalShort: (n) => `목표까지 ${n}%p 남았어요.`,
    tooEarly: (n) => `알림이 ${n}번은 쌓여야 비율이 의미 있어요.`,
    ignoredNote: (n) => `그냥 지나간 알림 ${n}번.`,
    noData: '아직 기록이 없어요. 첫 운동을 해볼까요?',
  },
  en: {
    eye: (n) => `Follow the hamster with your eyes · ${n}s`,
    far: (n) => `Look out a window · ${n}s`,
    stretch: (n) => `Stretch with me! · ${n}s`,
    done: 'Nice work! See you next time',

    trayStart: 'Exercise now',
    traySettings: 'Settings',
    trayQuit: 'Quit',

    moveHint: 'Drag me, then click',
    moveDone: 'Leave it here',
    settingsTitle: 'Settings',
    language: 'Language',
    theme: 'Appearance',
    settingsNote: 'Changes are saved right away.',
    lang_ko: '한국어',
    lang_en: 'English',
    theme_system: 'Match system',
    theme_light: 'Light',
    theme_dark: 'Dark',

    showPet: 'Show on desktop',
    showPetHelp: 'Even when off, the hamster appears during exercise.',
    followCursor: 'Follow my cursor’s screen',
    followCursorHelp: 'With more than one display, it shows up on the one you are using.',
    gearTitle: 'Accessories',
    packsTitle: 'Accessory packs',
    packsEmpty: 'No packs loaded yet.',
    packImport: 'Open a file',
    packRemove: 'Remove',
    packAdded: (name) => `${name} loaded. Already wearing it!`,
    packDrop: 'You can also drop the file here.',
    packBad: 'That does not look like an accessory pack.',
    packTooNew: 'This app is too old to open it. Update the app.',
    packFailed: 'Could not load it.',
    base: 'Under its feet',
    baseNone: 'Nothing',
    interval: 'Exercise every',
    minutes: (n) => `${n} min`,

    feedback: 'Send feedback',
    feedbackPlaceholder: 'Tell us what feels off, or what you wish it did.',
    feedbackEmail: 'Email for a reply (optional)',
    feedbackSends: (list) => `Also sent: ${list}`,
    feedbackSend: 'Send',
    feedbackSent: 'Sent. Thank you!',
    feedbackEmpty: 'Please write something first.',
    feedbackCooldown: (s) => `You can send again in ${s}s.`,
    feedbackFailed: "Couldn't send. Please try again shortly.",
    feedbackOff: 'Not connected yet (in development).',

    promptAsk: 'Take a break? It only takes 30 seconds.',
    promptAgain: (n) => `Put off again. ${n} in the cheeks now.`,
    promptNow: 'Do it now',
    promptSnooze: 'In 15 min',
    promptStop: 'Stop reminding you today?',
    promptOffToday: 'Stop today',
    promptKeepGoing: 'Keep going',

    trayMove: 'Move the hamster',
    trayDashboard: 'My stats',
    dashboardTitle: 'My stats',
    todayDone: 'Done today',
    todaySnooze: 'Put off today',
    thisWeek: 'Response rate',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    summaryFine: "You haven't put anything off today.",
    summarySnoozed: (n) => `Put off ${n} times today.`,
    goalMet: "You've hit this week's goal!",
    goalShort: (n) => `${n} points below your goal.`,
    tooEarly: (n) => `Needs ${n}+ reminders before the rate means much.`,
    ignoredNote: (n) => `${n} reminders went unanswered.`,
    noData: 'No records yet. Shall we do the first one?',
  },
};

export const LANGS = Object.keys(STRINGS);
const FALLBACK = 'en';
const KEY = 'lang';

// 저장된 선택 → OS 언어 → 영어 순으로 정한다.
function detect() {
  const saved = localStorage.getItem(KEY);
  if (saved && STRINGS[saved]) return saved;
  const base = (navigator.language || FALLBACK).toLowerCase().split('-')[0];
  return STRINGS[base] ? base : FALLBACK;
}

// 실행 중에 바뀔 수 있으므로 상수로 굳히지 않는다.
// 다른 창에서 언어를 바꾸면 refreshLang()으로 다시 읽어온다.
let current = detect();

export function getLang() {
  return current;
}

export function setLang(value) {
  if (!STRINGS[value]) return;
  localStorage.setItem(KEY, value);
  current = value;
}

export function refreshLang() {
  current = detect();
  return current;
}

export function t(key, ...args) {
  const entry = STRINGS[current]?.[key] ?? STRINGS[FALLBACK][key];
  return typeof entry === 'function' ? entry(...args) : entry;
}
