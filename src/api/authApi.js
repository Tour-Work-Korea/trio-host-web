import api from "./axiosInstance";
import { getCookie } from "@utils/authFlow";

const authApi = {
  //로그인
  login: (email, password) =>
    api.post("/auth/login", { email, password, userRole: "HOST" }),

  //토큰 갱신
  refreshToken: () =>
    api.post("/auth/refresh", { refreshToken: getCookie("refresh-token") }),

  //로그아웃
  logout: () =>
    api.post("/auth/logout", { refreshToken: getCookie("refresh-token") }),

  //프로필 조회
  getMyProfile: () => api.get("/host/my", { isAuth: true }),

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
};

export default authApi;
