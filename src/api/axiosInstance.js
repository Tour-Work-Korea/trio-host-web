import axios from "axios";
import useUserStore from "@stores/userStore";
import { tryRefresh } from "@utils/authFlow";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

//accessToken 자동 주입
api.interceptors.request.use((config) => {
  const state = useUserStore.getState();
  const token = state.accessToken;
  const withAuth = typeof state.isAuth === "boolean" ? state.isAuth : !!token;

  if (withAuth) config.headers.Authorization = `Bearer ${token}`;
  config.withCredentials = !!withAuth;
  return config;
});

//401처리: 1회 리프레시 후 재시도
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err || {};
    if (!response) throw err;
    if (response.status !== 401 || config._retry) throw err;

    config._retry = true;

    // refresh 한 번만 수행 (동시 요청 큐잉)
    if (!refreshing) refreshing = tryRefresh(); // 기본은 쿠키 우선, 필요시 body 폴백
    const ok = await refreshing.finally(() => (refreshing = null));

    if (!ok) {
      useUserStore.getState().clearUser();
      throw err;
    }

    // 새 토큰으로 원 요청 재시도
    const token = useUserStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return api(config);
  }
);

export default api;
