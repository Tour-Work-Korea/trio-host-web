import axios from "axios";
import useUserStore from "@stores/userStore";
import { tryRefresh } from "@utils/authFlow";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 5000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

//accessToken 자동 주입
api.interceptors.request.use((config) => {
  const { accessToken } = useUserStore.getState();

  // 1) 요청에서 withAuth 명시되면 그걸 우선
  // 2) 없으면 토큰 유무로 기본값 결정
  const withAuth = config.withAuth ?? !!accessToken;

  // 헤더 객체 보장
  config.headers ||= {};

  if (withAuth && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    // 요청별로 auth 끄면 혹시 남아있을 Authorization 제거
    delete config.headers.Authorization;
  }

  // withCredentials도 요청이 명시했으면 존중, 아니면 withAuth에 따름
  config.withCredentials = config.withCredentials ?? withAuth;

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
      localStorage.clear();
      throw err;
    }

    // 새 토큰으로 원 요청 재시도
    const token = useUserStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return api(config);
  }
);

export default api;
