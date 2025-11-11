import api from "./axiosInstance";

const commonApi = {
  // 비민감 이미지 presigned url 발급 (RN에서 사용)
  getPresignedUrl: (filename) =>
    api.get("/common/S3/presigned-url", {
      params: { filename },
      withAuth: false,
    }),

  // 민감/비민감 공통으로 쓸 수 있는 업로드 API (백엔드가 S3에 올림)
  postImage: (image, config = {}) =>
    api.post("/common/S3/upload", image, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config, // ← onUploadProgress 같은 옵션 받을 수 있게
    }),

  // 지역 조회
  getLocations: () =>
    api.get("/common/region-type", {
      withAuth: false,
    }),
};

export default commonApi;
