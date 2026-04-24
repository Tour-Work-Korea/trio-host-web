import axios from "axios";
import useUserStore from "@stores/userStore";
import { tryRefresh } from "@utils/authFlow";

const isDev = import.meta.env.DEV;
const envApiBase =
  import.meta.env.VITE_API_URL || "";
const normalizedEnvBase = String(envApiBase).replace(/\/$/, "");
const apiV1Base = /\/api\/v1$/.test(normalizedEnvBase)
  ? normalizedEnvBase
  : `${normalizedEnvBase}/api/v1`;
const API_BASE = isDev ? "/api/v1" : apiV1Base;
const enableApiLog = import.meta.env.DEV || import.meta.env.VITE_ENABLE_API_LOG === "true";

const redactHeaders = (headers = {}) => {
  const plain = { ...headers };
  if (plain.Authorization) {
    plain.Authorization = "[REDACTED]";
  }
  return plain;
};

const serializeData = (data) => {
  if (data instanceof FormData) {
    const form = {};
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        form[key] = {
          kind: "File",
          name: value.name,
          type: value.type,
          size: value.size,
        };
      } else if (value instanceof Blob) {
        form[key] = {
          kind: "Blob",
          type: value.type,
          size: value.size,
        };
      } else {
        form[key] = value;
      }
    }
    return { kind: "FormData", data: form };
  }
  return data;
};

const fullUrl = (config) => {
  const base = config?.baseURL || "";
  const url = config?.url || "";
  if (/^https?:\/\//.test(url)) return url;
  return `${base}${url}`;
};

const logRequest = (config) => {
  if (!enableApiLog) return;
  const traceId = config.__traceId || `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  config.__traceId = traceId;
  console.groupCollapsed(`[API][REQ][${traceId}] ${String(config.method || "GET").toUpperCase()} ${config.url}`);
  console.log("url:", fullUrl(config));
  console.log("params:", config.params ?? null);
  console.log("data:", serializeData(config.data));
  console.log("headers:", redactHeaders(config.headers || {}));
  console.groupEnd();
};

const logResponse = (response) => {
  if (!enableApiLog) return;
  const traceId = response?.config?.__traceId || "unknown";
  console.groupCollapsed(
    `[API][RES][${traceId}] ${response?.status} ${String(response?.config?.method || "GET").toUpperCase()} ${response?.config?.url}`
  );
  console.log("url:", fullUrl(response?.config));
  console.log("status:", response?.status);
  console.log("data:", response?.data);
  console.groupEnd();
};

const logError = (error) => {
  if (!enableApiLog) return;
  const traceId = error?.config?.__traceId || "unknown";
  const status = error?.response?.status ?? "NO_RESPONSE";
  console.groupCollapsed(
    `[API][ERR][${traceId}] ${status} ${String(error?.config?.method || "GET").toUpperCase()} ${error?.config?.url}`
  );
  console.log("url:", fullUrl(error?.config));
  console.log("status:", status);
  console.log("request:", {
    params: error?.config?.params ?? null,
    data: serializeData(error?.config?.data),
    headers: redactHeaders(error?.config?.headers || {}),
  });
  console.log("response:", error?.response?.data ?? null);
  console.log("message:", error?.message);
  console.groupEnd();
};

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const authClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  config.withCredentials = config.withCredentials ?? true;
  logRequest(config);
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (res) => {
    logResponse(res);
    return res;
  },
  async (err) => {
    logError(err);

    const { response, config } = err || {};
    if (!response) throw err;
    if (response.status !== 401 || config?._retry) throw err;
    if (String(config?.url || "").includes("/host/auth/refresh")) throw err;

    config._retry = true;

    if (!refreshing) refreshing = tryRefresh();
    const ok = await refreshing.finally(() => (refreshing = null));

    if (!ok) {
      useUserStore.getState().clearUser();
      throw err;
    }

    return api(config);
  }
);

export default api;
