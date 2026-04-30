import api from "./axiosInstance";

const adminApi = {
  // 홈 공지사항 조회
  getHomeNotices: () =>
    api.get("/host/notices/home", {
      withAuth: false,
    }),

  // 공지사항 목록 조회
  getAdminNotices: ({ category, q, page } = {}) =>
    api.get("/host/notices", {
      withAuth: false,
      params: {
        ...(category ? { category } : {}),
        ...(q ? { q } : {}),
        ...(typeof page === "number" && page > 0 ? { page } : {}),
      },
    }),

  // 공지사항 상세 조회
  getAdminNoticeDetail: (noticeId) =>
    api.get(`/host/notices/${noticeId}`, {
      withAuth: false,
    }),
};

export default adminApi;
