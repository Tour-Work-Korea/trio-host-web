import api from "./axiosInstance";
import { authClient } from "./axiosInstance";

const authApi = {
  //로그인
  login: (email, password) =>
    authClient.post("/host/auth/login", { email, password }),

  //토큰 갱신
  refreshToken: () => authClient.post("/host/auth/refresh"),

  //로그아웃
  logout: () => api.post("/host/auth/logout"),

  //실시간 접속 heartbeat
  heartbeat: () => authClient.post("/host/presence/heartbeat"),

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

  //프로필 수정
  updateProfile: (body) => api.put("/host/my", body),

  //사장님 회원가입
  signUp: (dtoObj, imgFile) => {
    const fd = new FormData();

    // ✅ dto를 JSON Blob으로 추가 (핵심)
    fd.append(
      "dto",
      new Blob([JSON.stringify(dtoObj)], { type: "application/json" })
    );

    // ✅ img는 File 그대로
    fd.append("img", imgFile);

    return api.post("/auth/host/web/signup", fd, {
      headers: {
        // axios가 boundary 포함해서 자동으로 multipart 설정하게 둠
        "Content-Type": undefined,
      },
      transformRequest: (data) => data,
    });
  },
};

export default authApi;
