import authApi from "@api/authApi";
import guesthouseApi from "@api/guesthouseApi";
import useUserStore from "@stores/userStore";

let pendingSessionBootstrap = null;

/**
 * 로그인
 */
export const tryLogin = async (email, password) => {
  try {
    // 1. 로그인 요청으로 쿠키 생성
    await authApi.login(email, password);

    // 2. 로그인 성공 시 즉시 프로필(게스트하우스 목록 포함) 새로 조회 및 스토어 갱신
    // (setProfile 내부에서 sessionReady, authenticated 모두 true로 변경됨)
    await updateProfile();

    return true;
  } catch (err) {
    useUserStore.getState().clearUser();
    throw err;
  }
};

/**
 * 로그인 후 프로필 업데이트
 */
export const updateProfile = async () => {
  const { setProfile } = useUserStore.getState();
  const res = await authApi.getMyProfile();

  // 백엔드 응답이 중첩된 형태일 수 있으므로 유연하게 추출
  const data = res.data?.data || res.data?.result || res.data || {};

  const { id, userId, hostId, memberId, name, photoUrl, phone, email, businessNum } = data;

  // 웹은 /host/my 에 게스트하우스 리스트가 안 들어있으므로 직접 호출해서 붙여줍니다.
  try {
    data.guesthouseProfiles = await guesthouseApi.getMyGuesthouseProfiles();
    // 일괄처리를 위해 객실 정보가 포함된 guesthouseStore의 데이터도 항상 최신화
    import("@stores/guesthouseStore").then(({ default: useGuesthouseStore }) => {
      useGuesthouseStore.getState().fetchGuesthouses();
    });
  } catch (error) {
    console.error("Failed to fetch guesthouses for hostProfile", error);
    data.guesthouseProfiles = [];
  }

  const parsedProfile = {
    ...data,
    id: id || userId || hostId || memberId || data.user_id || data.host_id || null,
    name: name ?? "",
    photoUrl:
      photoUrl && photoUrl !== "사진을 추가해주세요" ? photoUrl : null,
    phone: phone ?? "",
    email: email ?? "",
    businessNum: businessNum ?? "",
  };

  setProfile(parsedProfile, data);
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
