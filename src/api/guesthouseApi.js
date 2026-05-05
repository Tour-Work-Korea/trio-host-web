import api from "./axiosInstance";

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

const guesthouseApi = {

  // 내 게스트하우스 목록 조회 (입점신청서 API를 기반으로 통합 조회) -> 내가 가진 게스트하우스 목록 조회하는 것!
  getMyGuesthouseProfiles: async () => {
    try {
      const response = await api.get("/host/my/application");
      const list = Array.isArray(response.data) ? response.data : (response.data?.content || []);

      // 최신순 정렬
      return list.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Failed to fetch my guesthouse profiles", error);
      return [];
    }
  },
  // 내 게스트하우스 삭제 (정보 삭제가 아닌 게스트하우스 자체 삭제) 
  deleteApplication: (applicationId) =>
    api.delete(`/host/my/application/${applicationId}`),

  // 사장님 전체 게스트하우스 조회
  getMyGuesthouses: () => api.get("/host/guesthouses"),
  // 사장님 전체 게스트하우스 조회 - 방정보 포함
  getMyGuesthousesWithRooms: () => api.get("/host/guesthouses/with-rooms"),
  // 사장님 입점신청서 조회
  getMyApplications: () => api.get("/host/my/application"),


  // 특정 게스트하우스 상세 조회
  getGuesthouseDetail: (guesthouseId) =>
    api.get(`/host/guesthouses/${guesthouseId}`),

  // 게스트하우스 등록
  registerGuesthouse: (guesthouseData) =>
    api.post("/host/guesthouses", guesthouseData),

  // 게스트하우스 수정

  /** 게스트하우스 기본정보 수정 (이름/주소/전화/소개/체크인아웃/규칙)
   * body {
   *  guesthouseName, guesthouseAddress, guesthousePhone,
   *  guesthouseDetailAddress, guesthouseShortIntro,
   *  guesthouseLongDescription, checkIn, checkOut, rules
   * }
   * 부분 수정 가능: 필요한 필드만 포함해서 보내면 됨
   */
  updateGuesthouseBasic: (guesthouseId, payload) =>
    api.put(`/host/guesthouses/${guesthouseId}`, payload),

  /** 게스트하우스 이미지 수정
   * body: [{ guesthouseImageUrl: string, isThumbnail: boolean }, ...]
   * 규칙: 썸네일은 정확히 1개, 기존 포함 모든 이미지의 url 전체 전달
   */
  updateGuesthouseImages: (guesthouseId, images) =>
    api.put(`/host/guesthouses/${guesthouseId}/images`, images),

  /** 게스트하우스 해시태그 수정
   * body: [1,2,3]  // 해시태그 id 배열 (최대 3개, 기존 포함 전체 전달)
   */
  updateGuesthouseHashtags: (guesthouseId, hashtagIds) =>
    api.put(`/host/guesthouses/${guesthouseId}/hashtags`, hashtagIds),

  /** 게스트하우스 편의시설 수정
   * body: [{ amenityId: number, count: number }, ...]
   * 규칙: 기존 포함 모든 편의시설을 전체 전달
   */
  updateGuesthouseAmenities: (guesthouseId, amenities) =>
    api.put(`/host/guesthouses/${guesthouseId}/amenities`, amenities),

  /** 객실 기본 정보 수정
   * body {
   *  roomName, roomType, roomCapacity, roomMaxCapacity,
   *  roomDescription, roomPrice
   * }
   * 부분 수정 가능
   */
  updateRoomBasic: (guesthouseId, roomId, payload) =>
    api.put(`/host/guesthouses/${guesthouseId}/rooms/${roomId}`, payload),

  /** 객실 이미지 수정
   * body: [{ roomImageUrl: string, isThumbnail: boolean }, ...]
   * 규칙: 썸네일은 정확히 1개, 기존 포함 모든 이미지의 url 전체 전달
   */
  updateRoomImages: (guesthouseId, roomId, images) =>
    api.put(`/host/guesthouses/${guesthouseId}/rooms/${roomId}/images`, images),

  /** 객실 추가
   * body {
   *  roomName, roomType, roomCapacity, roomMaxCapacity,
   *  roomDescription, roomPrice,
   *  roomExtraFees: [{ startDate, endDate, addPrice }],
   *  roomImages: [{ roomImageUrl, isThumbnail }]
   * }
   */
  createRoom: (guesthouseId, roomPayload) =>
    api.post(`/host/guesthouses/${guesthouseId}/rooms`, roomPayload),

  // 객실 삭제
  deleteRoom: (guesthouseId, roomId) =>
    api.delete(`/host/guesthouses/${guesthouseId}/rooms/${roomId}`),

  // 게스트하우스 삭제
  deleteGuesthouse: (guesthouseId) =>
    api.delete(`/host/guesthouses/${guesthouseId}`),

  // 특정 게스트하우스 리뷰 목록 조회
  getGuesthouseReviews: ({ guesthouseId, page, size, sort }) =>
    api.get(`/${guesthouseId}/reviews`, {
      params: {
        page,
        size,
        sort,
      },
    }),

  // 리뷰에 대한 답글 작성
  postReviewReply: (reviewId, reply) =>
    api.post(`/host/reviews/${reviewId}/replies`, { reply }),

  // 리뷰 삭제 요청
  deleteReview: (reviewId, reason) =>
    api.post(`/host/reviews/${reviewId}`, {
      reason,
    }),

  // 사장님 입점신청서 조회
  getHostApplications: () => api.get("/host/my/application"),



  // 게스트하우스 프로필 경량 수정 API
  updateGuesthouseProfile: (guesthouseId, payload) =>
    api.put(`/host/guesthouses/${guesthouseId}/profile`, payload),

  // 사장님 입점 신청서 등록
  postHostApplication: (formData) =>
    api.post("/host/my/application", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 게하 예약 현황 조회
  getGuesthouseReservations: (guesthouseId) =>
    api.get(`/order/host/reservation/${guesthouseId}`),

  // 게하 예약 검색
  searchGuesthouseReservations: (params) =>
    api.get("/order/host/reservation/search", { params }),

  // 게하 예약 취소
  cancelGuesthouseReservation: (reservationId) =>
    api.delete(`/order/reservation/${reservationId}`, {
      data: { type: "GUESTHOUSE" },
    }),

  // 파트너 입점 신청 (랜딩페이지)
  postPartnerApplication: (payload) =>
    api.post("/host/guesthouses/partner-applications", payload),


  // 사장님 입점 신청서 등록 (= 게스트하우스 등록 시 필요한 첫번째 api)
  postApplication: (formData) => {
    if (!(formData.img instanceof File)) {
      throw new Error("img는 File이어야 합니다. (URL이 아니라 파일)");
    }
    const dto = {
      name: String(formData.businessName ?? "").trim(),
    };

    const multipart = new FormData();

    multipart.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    // 사업자 등록증 (백엔드 요구사항: businessCertificate)
    multipart.append("businessCertificate", formData.img);

    // 통장 사본 추가 (백엔드 요구사항: bankbookCopy)
    if (formData.bankBook) {
      multipart.append("bankbookCopy", formData.bankBook);
    }

    // 영업 신고증 추가 (백엔드 요구사항: businessReportCertificate)
    if (formData.businessLicense) {
      multipart.append("businessReportCertificate", formData.businessLicense);
    }

    return api.post("/host/my/application", multipart, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 입점 신청서 기반 임시 게스트하우스 생성 (= 게스트하우스 등록 시 필요한 두번째 api)
  tempCreateGuesthouse: (payload) =>
    api.post("/host/guesthouses/tempCreate", payload),
};

export default guesthouseApi;
