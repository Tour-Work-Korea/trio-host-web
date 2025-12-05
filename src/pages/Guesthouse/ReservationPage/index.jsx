/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import SelectModal from "@components/SelectModal";
import { useNavigate } from "react-router-dom";
import ReservationDeleteModal from "./ReservationDeleteModal";
import { dummyReservationsResponse } from "./dummyData";
import ButtonOrange from "@components/ButtonOrange";
import ButtonWhite from "@components/ButtonWhite";

const STATUS_LABELS = {
  PENDING: "예약 대기",
  CONFIRMED: "예약 확정",
  CANCELLED: "예약 취소",
  COMPLETED: "사용 완료",
};

export default function ReservationPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selected, setSelected] = useState(); // 선택된 게스트하우스 id
  const [reservations, setReservations] = useState([]); // 원본 예약 목록 (dummy)
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
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });

  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 10,
    status: "", // PENDING | CONFIRMED | CANCELLED | COMPLETED | ""
    startDate: "", // "YYYY-MM-DD"
    endDate: "",
    searchText: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    tryFetchGuesthouse();
    setReservations(dummyReservationsResponse.content || []);
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

      if (options.length > 0) {
        setSelected(options[0].id);
      }
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

  // 검색 파라미터 변경 핸들러
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
  const handleDeleteReservation = (id) => {
    setErrorModal({
      visible: true,
      title: `삭제 요청은 관리자의 검토 후 처리돼요\n계속 진행하시겠어요?`,
      message: null,
      buttonText: "네, 요청할래요",
      buttonText2: "보류할게요",
      onPress: () => {
        setDeleteModal({ visible: true, id });
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

  // 필터링된 예약 목록 (게스트하우스 + 날짜 + 상태 + 검색어)
  const filteredReservations = useMemo(() => {
    let list = [...reservations];

    // 선택된 게스트하우스 기준 필터
    if (selected) {
      list = list.filter((r) => r.guesthouseId === selected);
    }

    const { status, startDate, endDate, searchText } = searchParams;

    // 상태 필터
    if (status) {
      list = list.filter((r) => r.status === status);
    }

    // 날짜 필터 (체크인/체크아웃 기준 단순 포함)
    if (startDate) {
      list = list.filter((r) => r.checkInDate >= startDate);
    }
    if (endDate) {
      list = list.filter((r) => r.checkOutDate <= endDate);
    }

    // 검색어 필터 (예약자 이름, 전화번호, 게스트하우스명, 객실명, 예약번호)
    if (searchText.trim()) {
      const q = searchText.trim();
      list = list.filter((r) =>
        [
          r.userName,
          r.userPhone,
          r.guesthouseName,
          r.roomName,
          String(r.reservationId),
        ].some((field) => field && field.includes(q))
      );
    }

    return list;
  }, [reservations, selected, searchParams]);

  // 페이징 처리
  const pageSize = searchParams.size;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReservations.length / pageSize || 1)
  );

  // 현재 페이지 범위 보정
  useEffect(() => {
    if (page >= totalPages) {
      setPage(0);
    }
  }, [page, totalPages]);

  const paginatedReservations = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredReservations.slice(start, end);
  }, [filteredReservations, page, pageSize]);

  // pageInfo 갱신 (UI용)
  useEffect(() => {
    setPageInfo({
      totalPages,
      totalElements: filteredReservations.length,
      first: page === 0,
      last: page === totalPages - 1,
    });
  }, [filteredReservations.length, page, totalPages]);

  // 페이지 이동
  const handleChangePage = (newPage) => {
    if (newPage === page) return;
    if (newPage < 0 || newPage >= totalPages) return;
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
            value={selected ?? ""}
            onChange={handleChangeGuesthouse}
            className="flex-1 w-full form-input"
          >
            {guesthouses.length === 0 && (
              <option value="">등록된 게스트하우스가 없습니다</option>
            )}
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
            placeholder="예약자 이름, 연락처, 객실명, 예약번호 등으로 검색"
            value={searchParams.searchText}
            onChange={(e) =>
              handleChangeSearchParam("searchText", e.target.value)
            }
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
                setPage(0);
              }}
            />
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      {paginatedReservations.length === 0 ? (
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
              {page + 1} / {pageInfo.totalPages} 페이지
            </p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto rounded-2xl border border-grayscale-200">
            <table className="min-w-full text-sm">
              <thead className="bg-grayscale-50">
                <tr className="h-10 text-center text-sm text-grayscale-500">
                  <th className="px-3">상태</th>
                  <th className="px-3">예약번호</th>
                  <th className="px-3">게스트하우스 / 객실</th>
                  <th className="px-3">예약자 이름</th>
                  <th className="px-3">예약자 전화번호</th>
                  <th className="px-3">인원수</th>
                  <th className="px-3">요청 사항</th>
                  <th className="px-3">결제 금액</th>
                  <th className="px-3">예약 취소</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map((item) => (
                  <tr
                    key={item.reservationId}
                    className="h-12 border-t border-grayscale-100 text-sm text-grayscale-700"
                  >
                    {/* 상태 */}
                    <td className="px-3 text-center align-middle">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* 예약번호 */}
                    <td className="px-3 text-center align-middle">
                      {item.reservationId}
                    </td>

                    {/* 게스트하우스 / 객실 */}
                    <td className="px-3 text-left align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-grayscale-900">
                          {item.guesthouseName}
                        </span>
                        <span className="text-sm text-grayscale-500">
                          {item.roomName} · {item.roomCapacity}인실
                        </span>
                      </div>
                    </td>

                    {/* 예약자 이름 */}
                    <td className="px-3 text-center align-middle">
                      {item.userName}
                    </td>

                    {/* 예약자 전화번호 */}
                    <td className="px-3 text-center align-middle">
                      {item.userPhone}
                    </td>

                    {/* 인원수 */}
                    <td className="px-3 text-center align-middle">
                      {item.guestCount}명
                    </td>

                    {/* 요청 사항 */}
                    <td className="px-3 text-left align-middle max-w-[260px]">
                      <p className=" text-grayscale-700 whitespace-pre-wrap leading-relaxed">
                        {item.requests && item.requests.trim()
                          ? item.requests
                          : "요청 사항 없음"}
                      </p>
                    </td>

                    {/* 결제 금액 */}
                    <td className="px-3 text-right align-middle whitespace-nowrap">
                      {item.amount.toLocaleString()}원
                    </td>

                    {/* 예약 취소 버튼 */}
                    <td className="px-3 text-center align-middle">
                      {(item.status === "PENDING" ||
                        item.status === "CONFIRMED") && (
                        <button
                          type="button"
                          className="rounded-full bg-primary-orange px-4 py-1 text-sm font-semibold text-white hover:opacity-90"
                          onClick={() =>
                            handleDeleteReservation(item.reservationId)
                          }
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
              {page + 1} / {pageInfo.totalPages}
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
        id={deleteModal.id}
        visible={deleteModal.visible}
        onClose={() => setDeleteModal({ visible: false, id: null })}
        setErrorModal={setErrorModal}
      />
    </div>
  );
}
