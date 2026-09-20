// 피드백 전송.
//
// 보내는 곳은 구글 Apps Script 웹앱이고, 그게 스프레드시트에 한 줄 넣고
// 알림 메일까지 보낸다. 앱에는 이 URL 하나만 들어간다 —
// **계정 정보나 비밀 키는 절대 앱에 넣지 않는다.** 배포된 앱에서 다 추출된다.
//
// 아직 URL이 없어서 비워뒀다. 여기에 주소만 붙이면 바로 동작한다.
// 만드는 절차(스크립트 코드 포함): docs/feedback-setup.md
// 왜 이 방식인지: docs/ADR.md 16번
export const FEEDBACK_URL = '';

export const MAX_LENGTH = 1000;

// 같은 사람이 연달아 보내는 것만 막는다. 서버가 없으니 이 이상은 할 수 없고,
// 문제가 생기면 URL을 새로 발급받아 다음 버전에 넣는 게 대책이다.
const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = 'feedbackSentAt';

export function cooldownLeftMs() {
  const last = Number(localStorage.getItem(LAST_SENT_KEY) || 0);
  return Math.max(COOLDOWN_MS - (Date.now() - last), 0);
}

/// 함께 보내는 정보. 사용자에게 이 목록을 그대로 보여준 뒤에 보낸다.
export function context() {
  return {
    version: '0.1.0',
    platform: navigator.platform || 'unknown',
    language: navigator.language || 'unknown',
  };
}

export async function send({ message, email }) {
  if (!FEEDBACK_URL) throw new Error('NOT_CONFIGURED');
  if (!message.trim()) throw new Error('EMPTY');
  if (cooldownLeftMs() > 0) throw new Error('COOLDOWN');

  const body = JSON.stringify({
    message: message.slice(0, MAX_LENGTH),
    email: email.trim(),
    ...context(),
  });

  // Apps Script는 CORS 사전 요청을 처리하지 않으므로 text/plain으로 보낸다.
  const res = await fetch(FEEDBACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });
  if (!res.ok) throw new Error(`HTTP_${res.status}`);

  localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
}
