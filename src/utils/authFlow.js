import authApi from "@api/authApi";
import useUserStore from "@stores/userStore";

/**
 * 로그인
 */
export const tryLogin = async (email, password) => {
  const { setTokens } = useUserStore.getState();
  try {
    const res = await authApi.login(email, password);

    setTokens({ accessToken: res?.data?.accessToken });
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
const updateProfile = async () => {
  const { setProfile } = useUserStore.getState();
  try {
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
  } catch (error) {
    console.warn(`👤 profile fetch failed(web):`, error?.message);
  }
};

/**
 * 토큰 리프레시
 */
export const tryRefresh = async () => {
  console.info("🔄 tryRefresh: start");
  try {
    const res = await authApi.refreshToken();
    const accessToken = res?.data?.accessToken;

    useUserStore.getState().setTokens({ accessToken });
    console.info("🔄 tryRefresh(web): new accessToken=", accessToken);
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
    useUserStore.getState().clearUser();
    localStorage.clear();
  } catch (error) {
    console.warn(
      "logout failed:",
      error?.response?.status,
      error?.response?.data?.message
    );
  }
};

/**
 * 쿠키 조회
 */
export function getCookie(name) {
  const key = name + "=";
  const arr = document.cookie.split(";");
  for (let c of arr) {
    c = c.trim();
    if (c.indexOf(key) === 0)
      return decodeURIComponent(c.substring(key.length));
  }
  return null;
}
