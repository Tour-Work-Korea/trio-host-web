const DEFAULT_OPTIONS = {
  version: 1,                 // 폼 구조 바뀌면 올려서 구버전 드래프트 무시 가능
  ttlMs: 1000 * 60 * 60 * 24, // 1일 보관 (원하면 null로 만료 없음)
  storage: window.localStorage,
  prefix: "draft:",           // localStorage key prefix
};

// 안전한 JSON parse
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// 폼이 커서 에러나는 경우 대비 (용량 초과 등)
function safeSetItem(storage, key, value) {
  try {
    storage.setItem(key, value);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export function createDraftStore(namespace, options = {}) {
  const opt = { ...DEFAULT_OPTIONS, ...options };
  const key = `${opt.prefix}${namespace}`;

  function save(data) {
    const payload = {
      v: opt.version,
      savedAt: Date.now(),
      data,
    };
    return safeSetItem(opt.storage, key, JSON.stringify(payload));
  }

  function load() {
    const raw = opt.storage.getItem(key);
    if (!raw) return { exists: false, data: null };

    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== "object") {
      // 깨진 데이터면 제거
      opt.storage.removeItem(key);
      return { exists: false, data: null };
    }

    // 버전 다르면 무시
    if (parsed.v !== opt.version) {
      return { exists: false, data: null, reason: "version_mismatch" };
    }

    // TTL 체크
    if (opt.ttlMs != null && parsed.savedAt) {
      const expired = Date.now() - parsed.savedAt > opt.ttlMs;
      if (expired) {
        opt.storage.removeItem(key);
        return { exists: false, data: null, reason: "expired" };
      }
    }

    return { exists: true, data: parsed.data, savedAt: parsed.savedAt };
  }

  function clear() {
    opt.storage.removeItem(key);
  }

  function exists() {
    return opt.storage.getItem(key) != null;
  }

  return { key, save, load, clear, exists };
}
