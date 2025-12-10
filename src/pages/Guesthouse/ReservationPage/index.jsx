/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";
import ReservationDeleteModal from "./ReservationDeleteModal";
import ButtonWhite from "@components/ButtonWhite";

const STATUS_LABELS = {
  PENDING: "예약 대기",
  CONFIRMED: "예약 확정",
  CANCELLED: "예약 취소",
  COMPLETED: "사용 완료",
};

export default function ReservationPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selected, setSelected] = useState(-1); // 선택된 게스트하우스 id
  const [reservations, setReservations] = useState([]);

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    buttonText2: null,
    onPress: () =>
      setErrorModal((prev) => ({
        ...prev,
        visible: false,
      })),
    onPress2: null,
    imgUrl: null,
  });
  const [selectModal, setSelectModal] = useState({ visible: false });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    reservation: null,
  });

  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  // 🔹 서버로 보낼 검색 조건 상태
  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 10,
    status: "",
    startDate: "",
    endDate: "",
    searchText: "", // 실제 서버로 나가는 keyword
  });

  // 🔹 인풋에 표시되는 검색어 (타이핑용)
  const [keywordInput, setKeywordInput] = useState("");
  // 🔹 디바운스된 검색어 (요청 트리거용)
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    tryFetchGuesthouse();
  }, []);

  // 게스트하우스 목록 조회
  const tryFetchGuesthouse = async () => {
    try {
      const res = await guesthouseApi.getMyGuesthouses();

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const options = list.map((g) => ({
        id: g.id ?? g.guesthouseId,
        title: g.guesthouseName,
        subtitle: g.guesthouseAddress,
      }));

      setGuesthouses(options);
    } catch (error) {
      console.warn(
        "나의 게스트하우스 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "나의 게스트하우스 조회 실패",
        message:
          error?.response?.data?.message ||
          "나의 게스트하우스 조회 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
        onPress2: null,
        imgUrl: null,
      });
    }
  };

  // 🔹 검색 파라미터 변경 (검색어 외 필드용)
  const handleChangeSearchParam = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
      page: 0,
    }));
    setPage(0);
  };

  // 게스트하우스 선택 변경 핸들러
  const handleChangeGuesthouse = (e) => {
    const id = Number(e.target.value);
    setSelected(id);
    setPage(0);
  };

  // 삭제 요청 핸들러
  const handleDeleteReservation = (reservation) => {
    setErrorModal({
      visible: true,
      title: `삭제 요청은 관리자의 검토 후 처리돼요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "네, 요청할래요",
      buttonText2: "보류할게요",
      onPress: () => {
        setDeleteModal({
          visible: true,
          reservation,
        });
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        }));
      },
      onPress2: () =>
        setErrorModal((prev) => ({
          ...prev,
          visible: false,
        })),
      imgUrl: null,
    });
  };

  // 🔹 검색어 디바운스: 500ms 동안 입력 멈추면 searchParams에 반영
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keywordInput.trim());
      setSearchParams((prev) => ({
        ...prev,
        page: 0,
        searchText: keywordInput.trim(),
      }));
      setPage(0);
    }, 500); // 0.5초

    return () => clearTimeout(timer);
  }, [keywordInput]);

  // ---------------------- 서버에서 예약 목록 조회 ----------------------
  const tryFetchReservations = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: searchParams.size,
        status: searchParams.status || undefined,
        startDate: searchParams.startDate || undefined,
        endDate: searchParams.endDate || undefined,
        keyword: debouncedKeyword || undefined, // ✅ 디바운스된 값만 서버로
        ...(selected !== -1 && { guesthouseId: selected }),
      };
      const res = await guesthouseApi.searchGuesthouseReservations(params);
      const data = res?.data || res;

      const content = Array.isArray(data?.content) ? data.content : [];

      setReservations(content);
      setPageInfo({
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        first: data?.first ?? page === 0,
        last:
          data?.last ??
          (data?.totalPages != null ? page === data.totalPages - 1 : true),
      });
    } catch (error) {
      console.warn(
        "게스트하우스 예약 목록 조회 실패:",
        error?.response?.data?.message || error
      );
      setErrorModal({
        visible: true,
        title: "예약 목록 조회 실패",
        message:
          error?.response?.data?.message ||
          "예약 목록 조회 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
        onPress2: null,
        imgUrl: null,
      });
      setReservations([]);
      setPageInfo({
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 선택된 게하 / 검색 조건 / 페이지가 바뀔 때마다 서버 호출
  useEffect(() => {
    // selected는 -1도 truthy라, 전체 조회도 허용하는 현재 로직 유지
    tryFetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    page,
    searchParams.status,
    searchParams.startDate,
    searchParams.endDate,
    searchParams.size,
    debouncedKeyword, // ✅ 실제 요청 트리거는 이 값
  ]);

  // 페이지 이동
  const handleChangePage = (newPage) => {
    if (newPage === page) return;
    if (newPage < 0) return;
    if (pageInfo.totalPages && newPage >= pageInfo.totalPages) return;

    setPage(newPage);
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const renderStatusBadge = (status) => {
    const label = STATUS_LABELS[status] || status;
    let bg = "bg-gray-100 text-gray-700";

    if (status === "PENDING") bg = "bg-yellow-50 text-yellow-700";
    if (status === "CONFIRMED") bg = "bg-green-50 text-green-700";
    if (status === "CANCELLED") bg = "bg-red-50 text-red-600";
    if (status === "COMPLETED") bg = "bg-blue-50 text-blue-700";

    return (
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${bg}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <div className="page-title">예약 관리</div>
      </div>

      {/* 검색 조건 영역 */}
      <div className="mb-4 rounded-2xl bg-grayscale-100 p-8 flex flex-col gap-4">
        {/* 1. 게스트하우스 선택 */}
        <div className="flex items-center gap-4">
          <p className="mb-1 font-semibold text-grayscale-700 flex">
            게스트하우스 선택
          </p>
          <select
            id="guesthouse"
            value={selected}
            onChange={handleChangeGuesthouse}
            className="flex-1 w-full form-input"
          >
            <option value={-1}>전체 게스트하우스</option>

            {guesthouses.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title} ({opt.subtitle})
              </option>
            ))}
          </select>
        </div>

        {/* 2. 날짜 / 상태 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 날짜 기간 */}
          <div className="flex gap-2 items-center">
            <p className="font-semibold w-13">기간</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="form-input"
                value={searchParams.startDate}
                onChange={(e) =>
                  handleChangeSearchParam("startDate", e.target.value)
                }
              />
              <span className="text-sm text-grayscale-500">~</span>
              <input
                type="date"
                className="form-input"
                value={searchParams.endDate}
                onChange={(e) =>
                  handleChangeSearchParam("endDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* 상태 */}
          <div className="flex gap-2 items-center">
            <p className="font-semibold w-13">상태</p>
            <select
              className="min-w-[140px] form-input"
              value={searchParams.status}
              onChange={(e) =>
                handleChangeSearchParam("status", e.target.value)
              }
            >
              <option value="">전체</option>
              <option value="PENDING">예약 대기</option>
              <option value="CONFIRMED">예약 확정</option>
              <option value="CANCELLED">예약 취소</option>
              <option value="COMPLETED">사용 완료</option>
            </select>
          </div>
        </div>

        {/* 검색어 */}
        <div className="flex gap-2 items-center">
          <p className="font-semibold w-13">검색어</p>
          <input
            type="text"
            className="flex-1 w-full form-input"
            placeholder="회원 이름으로 검색"
            value={keywordInput} // 🔹 인풋은 타이핑용 상태 사용
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <div>
            <ButtonWhite
              title="초기화"
              onPress={() => {
                setSearchParams({
                  page: 0,
                  size: 10,
                  status: "",
                  startDate: "",
                  endDate: "",
                  searchText: "",
                });
                setKeywordInput(""); // 🔹 인풋도 리셋
                setDebouncedKeyword("");
                setPage(0);
              }}
            />
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      {reservations.length === 0 && !loading ? (
        <div className="body-container scrollbar-hide h-[500px]">
          <EmptyComponent title="해당 조건에 맞는 예약이 없어요" />
        </div>
      ) : (
        <div className="scrollbar-hide flex flex-col gap-3 mt-8">
          {/* 상단 요약 */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">
              총{" "}
              <span className=" text-primary-orange">
                {pageInfo.totalElements}
              </span>
              건의 예약이 있습니다.
            </p>
            <p className="text-sm text-grayscale-500">
              {page + 1} / {pageInfo.totalPages || 1} 페이지
            </p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto rounded-2xl border border-grayscale-200">
            <table className="min-w-[1100px] text-sm table-auto">
              <thead className="bg-grayscale-50">
                <tr className="h-10 text-center text-sm text-grayscale-500">
                  <th className="px-3 whitespace-nowrap w-24">상태</th>
                  <th className="px-3 whitespace-nowrap w-28">예약번호</th>
                  <th className="px-3 whitespace-nowrap w-56">
                    게스트하우스 / 객실
                  </th>
                  <th className="px-3 whitespace-nowrap w-44">예약 기간</th>
                  <th className="px-3 whitespace-nowrap w-32">예약자 이름</th>
                  <th className="px-3 whitespace-nowrap w-40">
                    예약자 전화번호
                  </th>
                  <th className="px-3 whitespace-nowrap w-24">인원수</th>
                  <th className="px-3 whitespace-nowrap w-44">요청 사항</th>
                  <th className="px-3 whitespace-nowrap w-32">결제 금액</th>
                  <th className="px-3 whitespace-nowrap w-32">예약 취소</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((item) => (
                  <tr
                    key={item.reservationId}
                    className="h-12 border-t border-grayscale-100 text-sm text-grayscale-700"
                  >
                    {/* 상태 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* 예약번호 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {item.reservationId}
                    </td>

                    {/* 게스트하우스 / 객실 */}
                    <td className="px-3 text-left align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-grayscale-900 truncate">
                          {item.guesthouseName}
                        </span>
                        <span className="text-sm text-grayscale-500 whitespace-nowrap">
                          {item.roomName} · {item.roomCapacity}인실
                        </span>
                      </div>
                    </td>

                    {/* 예약 기간 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {item.checkInDate} ~ {item.checkOutDate}
                    </td>

                    {/* 예약자 이름 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {item.userName}
                    </td>

                    {/* 예약자 전화번호 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {item.userPhone}
                    </td>

                    {/* 인원수 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {item.guestCount}명
                    </td>

                    {/* 요청 사항 */}
                    <td className="px-3 text-left align-middle">
                      <p className="text-grayscale-700 whitespace-nowrap leading-relaxed break-words max-w-50">
                        {item.requests && item.requests.trim()
                          ? item.requests
                          : ""}
                      </p>
                    </td>

                    {/* 결제 금액 */}
                    <td className="px-3 text-right align-middle whitespace-nowrap">
                      {item.amount.toLocaleString()}원
                    </td>

                    {/* 예약 취소 버튼 */}
                    <td className="px-3 text-center align-middle whitespace-nowrap">
                      {(item.status === "PENDING" ||
                        item.status === "CONFIRMED") && (
                        <button
                          type="button"
                          className="rounded-full bg-primary-orange px-4 py-1 text-sm font-semibold text-white hover:opacity-90"
                          onClick={() => handleDeleteReservation(item)}
                        >
                          취소하기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이징 버튼 */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${
                pageInfo.first
                  ? "bg-grayscale-100 text-grayscale-400"
                  : "bg-white text-grayscale-700 border border-grayscale-300 hover:bg-grayscale-50"
              }`}
              disabled={pageInfo.first}
              onClick={() => handleChangePage(page - 1)}
            >
              이전
            </button>
            <span className="text-sm text-grayscale-600">
              {page + 1} / {pageInfo.totalPages || 1}
            </span>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${
                pageInfo.last
                  ? "bg-grayscale-100 text-grayscale-400"
                  : "bg-white text-grayscale-700 border border-grayscale-300 hover:bg-grayscale-50"
              }`}
              disabled={pageInfo.last}
              onClick={() => handleChangePage(page + 1)}
            >
              다음
            </button>
          </div>
        </div>
      )}

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
        buttonText2={errorModal.buttonText2 ?? null}
        onPress={errorModal.onPress}
        onPress2={errorModal.onPress2 ?? null}
        imgUrl={errorModal.imgUrl ?? null}
      />

      <SelectModal
        visible={selectModal.visible}
        title={"게스트하우스를 선택해 주세요"}
        items={guesthouses}
        onClose={() => setSelectModal({ visible: false })}
        onPress={() => {
          setSelectModal({ visible: false });
          navigate(`/employ/recruit-form/`);
        }}
      />

      <ReservationDeleteModal
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: null })}
        setErrorModal={setErrorModal}
        reservation={deleteModal.reservation}
      />
    </div>
  );
}
