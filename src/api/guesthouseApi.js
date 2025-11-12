import api from "./axiosInstance";

const guesthouseApi = {
  // 사장님 전체 게스트하우스 조회
  getMyGuesthouses: () => api.get("/host/guesthouses"),
  // 사장님 입점신청서 조회
  getMyApplications: () => api.get("/host/my/application"),
  // 사장님 입점 신청서 등록
  postApplication: (formData) =>
    api.post("/host/my/application", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default guesthouseApi;
