import authApi from "@api/authApi";
import useUserStore from "@stores/userStore";

let pendingSessionBootstrap = null;

/**
 * 로그인
 */
export const tryLogin = async (email, password) => {
  try {
    useUserStore.getState().setSessionReady(false);
    await authApi.login(email, password);
    useUserStore.getState().setAuthenticated(true);
    const bootstrapped = await bootstrapSession();
    if (!bootstrapped) {
      throw new Error("host web session bootstrap failed");
    }
    return true;
  } catch (err) {
    useUserStore.getState().clearUser();
    throw err;
  }
};

/**
 * 로그인 후 프로필 업데이트
 */
const updateProfile = async () => {
  const { setProfile } = useUserStore.getState();
  const res = await authApi.getMyProfile();
  const { name, photoUrl, phone, email, businessNum } = res.data || {};
  setProfile({
    name: name ?? "",
    photoUrl:
      photoUrl && photoUrl !== "사진을 추가해주세요" ? photoUrl : null,
    phone: phone ?? "",
    email: email ?? "",
    businessNum: businessNum ?? "",
  });
};

/**
 * 세션 부트스트랩
 */
export const bootstrapSession = async () => {
  const { sessionReady, authenticated } = useUserStore.getState();
  if (sessionReady) {
    return authenticated;
  }

  if (!pendingSessionBootstrap) {
    pendingSessionBootstrap = (async () => {
      try {
        await updateProfile();
        return true;
      } catch (error) {
        console.warn(`👤 profile bootstrap failed(web):`, error?.message);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          useUserStore.getState().clearUser();
          return false;
        }
        useUserStore.getState().setSessionReady(true);
        return useUserStore.getState().authenticated;
      } finally {
        pendingSessionBootstrap = null;
      }
    })();
  }

  return pendingSessionBootstrap;
};

/**
 * 토큰 리프레시
 */
export const tryRefresh = async () => {
  try {
    await authApi.refreshToken();
    useUserStore.getState().setAuthenticated(true);
    return true;
  } catch (error) {
    console.warn(
      "❌ tryRefresh failed:",
      error?.response?.status,
      error?.message
    );
    useUserStore.getState().clearUser();
    return false;
  }
};

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.warn(
      "logout failed:",
      error?.response?.status,
      error?.response?.data?.message
    );
  } finally {
    useUserStore.getState().clearUser();
  }
};
