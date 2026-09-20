// 앱을 브라우저에서 그대로 돌리기 위한 Tauri 대체물.
//
// 앱 코드는 한 줄도 고치지 않는다. 앱이 Tauri를 전역(window.__TAURI__)으로 쓰기 때문에
// 앱 스크립트보다 먼저 이 파일이 전역을 정의해두면 그대로 속는다.
// 로직(상태 머신·운동 순서·응답률)을 베끼지 않는 게 핵심이다. 베끼면 반드시 갈라진다.
//
// 창을 다루는 명령은 부모(데모 페이지)에게 넘기고, 데이터는 여기서 localStorage로 처리한다.
(() => {
  const KEY = 'demo-events';

  // 창 사이 이벤트(emit/listen)는 부모를 거쳐 모든 iframe으로 퍼진다.
  const handlers = new Map();
  let seq = 0;
  const waiting = new Map();

  function toParent(message) {
    parent.postMessage({ hamstretch: true, ...message }, '*');
  }

  window.addEventListener('message', (e) => {
    const data = e.data;
    if (!data?.hamstretch) return;

    if (data.type === 'event') {
      for (const fn of handlers.get(data.event) ?? []) fn({ payload: data.payload });
    }
    if (data.type === 'reply' && waiting.has(data.id)) {
      waiting.get(data.id)(data.value);
      waiting.delete(data.id);
    }
  });

  function ask(cmd, args) {
    return new Promise((resolve) => {
      const id = ++seq;
      waiting.set(id, resolve);
      toParent({ type: 'invoke', cmd, args, id });
    });
  }

  // 기록은 앱과 같은 형식(JSON 한 줄씩)으로 둔다. events.js가 그대로 파싱한다.
  function append(kind) {
    const line = JSON.stringify({ t: Date.now(), type: kind });
    localStorage.setItem(KEY, (localStorage.getItem(KEY) ?? '') + line + '\n');
  }

  const local = {
    append_event: ({ kind }) => append(kind),
    read_events: () => localStorage.getItem(KEY) ?? '',
    // 데모를 보고 있는 사람은 자리에 있다. 자리 비움 판정이 끼어들면 알림이 안 뜬다.
    idle_seconds: () => 0,
    // 데모에 심어둔 꾸러미(겨울 세트). 앱에서 파일을 불러왔을 때와 같은 자리에 들어간다.
    list_packs: () => window.DEMO_PACKS ?? [],
    // 창이 아니라 iframe이라 의미가 없는 것들. 조용히 넘긴다.
    set_tray_state: () => null,
    set_tray_labels: () => null,
    set_click_through: () => null,
    set_follow_cursor: () => null,
    place_pet: () => null,
    get_pet_offset: () => [40, 40],
  };

  window.__TAURI__ = {
    core: {
      invoke(cmd, args) {
        if (cmd in local) return Promise.resolve(local[cmd](args ?? {}));
        return ask(cmd, args ?? {});
      },
    },
    // 대시보드가 창 제목을 바꾼다. 브라우저 탭에는 의미가 없지만, 없으면
    // 모듈 첫 줄의 구조 분해에서 바로 예외가 나서 화면이 통째로 비어버린다.
    window: {
      getCurrentWindow: () => ({
        setTitle: () => Promise.resolve(),
        close: () => Promise.resolve(),
      }),
    },
    event: {
      emit(event, payload) {
        toParent({ type: 'emit', event, payload });
        return Promise.resolve();
      },
      listen(event, fn) {
        if (!handlers.has(event)) handlers.set(event, []);
        handlers.get(event).push(fn);
        return Promise.resolve(() => {});
      },
    },
  };
})();
