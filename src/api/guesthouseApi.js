import api from "./axiosInstance";

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

const guesthouseApi = {
  // 사장님 전체 게스트하우스 조회
  getMyGuesthouses: () => api.get("/host/guesthouses"),
  // 사장님 입점신청서 조회
  getMyApplications: () => api.get("/host/my/application"),
  // 사장님 입점 신청서 등록
  postApplication: (formData) => {
    if (!(formData.img instanceof File)) {
      throw new Error("img는 File이어야 합니다. (URL이 아니라 파일)");
    }
    const dto = {
      name: String(formData.businessName ?? "").trim(),
      employeeCount: toInt(formData.employeeCount) ?? 0,
      address: String(formData.address ?? "").trim(),
      detailAddress: String(formData.detailAddress ?? "").trim(),
      managerName: String(formData.managerName ?? "").trim(),
      managerEmail: String(formData.managerEmail ?? "").trim(),
      businessPhone: String(formData.businessPhone ?? "").trim(),
      businessType: String(formData.businessType ?? "").trim(),
    };

    const multipart = new FormData();

    multipart.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    multipart.append("img", formData.img);

    return api.post("/host/my/application", multipart, {
      headers: { "Content-Type": undefined },
    });
  },
};

export default guesthouseApi;
