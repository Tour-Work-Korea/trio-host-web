import api from "./axiosInstance";

const guesthouseApi = {
  // 사장님 전체 게스트하우스 조회
  getMyGuesthouses: () => api.get("/host/guesthouses"),
};

export default guesthouseApi;
