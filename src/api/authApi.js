import api from "./axiosInstance";
import { authClient } from "./axiosInstance";
import { getCookie } from "@utils/authFlow";

const authApi = {
  //로그인
  login: (email, password) =>
    api.post(
      "/auth/login",
      { email, password, userRole: "HOST" },
      { withAuth: false }
    ),

  //토큰 갱신
  refreshToken: () =>
    authClient.post("/auth/refresh", {
      refreshToken: getCookie("refresh-token"),
    }),

  //로그아웃
  logout: () =>
    api.post("/auth/logout", { refreshToken: getCookie("refresh-token") }),

  //프로필 조회
  getMyProfile: () => api.get("/host/my"),

  //이메일 인증
  sendEmail: (email) =>
    api.post("/auth/email/send", null, {
      params: { email, userRole: "HOST" },
      withAuth: false,
    }),
  verifyEmail: (email, authCode) =>
    api.post("/auth/email/verify", null, {
      params: { email, authCode },
      withAuth: false,
    }),

  //사업자 번호 인증
  verifyBusiness: (businessNumber) =>
    api.post("/auth/business/verify", null, {
      params: { businessNumber },
      withAuth: false,
    }),
  //휴대폰 인증
  sendSms: (phoneNum) =>
    api.post("/auth/sms/send", null, {
      params: { phoneNum, userRole: "HOST" },
      withAuth: false,
    }),
  verifySms: (phoneNum, code) =>
    api.post("/auth/sms/verify", null, {
      params: { phoneNum, code },
      withAuth: false,
    }),
  //계졍찾기용 휴대폰 인증번호 발송
  verifySelfByPhone: (phoneNum) =>
    api.post("/auth/find/send-code", null, {
      params: { phoneNum, role: "HOST" },
      withAuth: false,
    }),

  //아이디 찾기
  findId: (phoneNum) =>
    api.get("/auth/find/email", {
      params: {
        phoneNum,
        role: "HOST",
      },
      withAuth: false,
    }),

  //비밀번호 찾기
  findPassword: (body) =>
    api.post("/auth/find/password", body, { withAuth: false }),
};

export default authApi;
