/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";

import EmptyComponent from "@components/EmptyComponent";
import ErrorModal from "@components/ErrorModal";
import guesthouseApi from "@api/guesthouseApi";
import ReservationCalendar from "@components/Calendar";
import ReservationDetailModal from "./ReservationDetailModal";
import {
  renderStatusBadge,
  STATUS_LABELS,
  STATUS_ORDER,
} from "@utils/reservationStatus";

const pad2 = (n) => String(n).padStart(2, "0");
const toYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// "YYYY-MM-DD" -> Date(로컬)
const parseYMD = (ymd) => {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

// checkIn ~ (checkOut-1) 날짜들에 예약을 찍음 (일반적인 숙박 정책)
const buildDateKeysInRange = (checkIn, checkOut) => {
  const s = parseYMD(checkIn);
  const e = parseYMD(checkOut);
  if (!s || !e) return [];

  const keys = [];
  const cur = new Date(s);

  const last = new Date(e);
  last.setDate(last.getDate() - 1);

  while (cur <= last) {
    keys.push(toYMD(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
};

export default function ReservationCalendarPage() {
  const [guesthouses, setGuesthouses] = useState([]);
  const [selected, setSelected] = useState(-1); // -1=전체

  const [reservations, setReservations] = useState([]);
  const [detailModal, setDetailModal] = useState({
    visible: false,
    reservation: null,
  });
  const [loading, setLoading] = useState(true);

  // 달력 표시 월
  const [monthDate, setMonthDate] = useState(() => new Date());
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

  useEffect(() => {
    tryFetchGuesthouse();
  }, []);

  // ✅ 현재 달 기준 조회 기간 계산
  const monthRange = useMemo(() => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0); // 이번달 마지막 날짜
    return {
      startDate: toYMD(start),
      endDate: toYMD(end),
    };
  }, [monthDate]);

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
      setErrorModal({
        visible: true,
        title: "나의 게스트하우스 조회 실패",
        message:
          error?.response?.data?.message ||
          "나의 게스트하우스 조회 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () => setErrorModal((prev) => ({ ...prev, visible: false })),
        onPress2: null,
        imgUrl: null,
      });
    }
  };

  // 달/게하/페이지가 바뀌면: 해당 달 기간으로 서버 조회
  const tryFetchReservations = async () => {
    setLoading(true);
    try {
      const params = {
        size: 200, // 달력은 넉넉히 (필요시 조절)
        startDate: monthRange.startDate,
        endDate: monthRange.endDate,
        ...(selected !== -1 && { guesthouseId: selected }),
      };

      const res = await guesthouseApi.searchGuesthouseReservations(params);
      const data = res?.data || res;
      const content = Array.isArray(data?.content) ? data.content : [];

      setReservations(content);
    } catch (error) {
      setErrorModal({
        visible: true,
        title: "예약 목록 조회 실패",
        message:
          error?.response?.data?.message ||
          "예약 목록 조회 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () => setErrorModal((prev) => ({ ...prev, visible: false })),
        onPress2: null,
        imgUrl: null,
      });
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tryFetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, monthRange.startDate, monthRange.endDate]);

  const handleChangeGuesthouse = (e) => {
    const id = Number(e.target.value);
    setSelected(id);
  };

  // ✅ 달력 셀에 표시할 “날짜별 예약 묶음”
  const itemsByDate = useMemo(() => {
    const map = new Map(); // dateKey -> reservations[]
    for (const r of reservations) {
      const keys = buildDateKeysInRange(r.checkInDate, r.checkOutDate);
      keys.forEach((k) => {
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(r);
      });
    }
    return map;
  }, [reservations]);

  const getItemsForDate = (dateKey) => itemsByDate.get(dateKey) || [];

  const renderItem = (item) => {
    return (
      <div
        className="flex items-center gap-1"
        onClick={() => setDetailModal({ visible: true, reservation: item })}
      >
        <div>{renderStatusBadge({ isFull: false, status: item.status })}</div>
        <div className="text-sm font-medium text-grayscale-800 truncate">
          {item.roomName}
        </div>
      </div>
    );
  };

  const renderTop = () => {
    return (
      <div className="flex gap-2">
        {STATUS_ORDER.map((el, id) => (
          <div key={id} className="flex gap-1 items-center">
            <div>{renderStatusBadge({ isFull: false, status: el })}</div>
            <div className="text-sm">{STATUS_LABELS[el]}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="page-title">예약 캘린더</div>
      </div>

      {/* 게하 선택 드롭다운만 유지 */}
      <div className="mb-4 mt-4">
        <select
          id="guesthouse"
          value={selected}
          onChange={handleChangeGuesthouse}
          className="w-full rounded-xl border-2 border-primary-blue px-3 py-2 outline-none"
        >
          <option value={-1}>전체 게스트하우스</option>
          {guesthouses.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
      </div>

      <div className="body-container scrollbar-hide">
        {guesthouses.length === 0 && !loading ? (
          <div className="h-[500px]">
            <EmptyComponent
              title="등록한 게스트하우스가 없어요"
              subtitle="게스트하우스를 등록하러 갈까요?"
              buttonText="게스트하우스 등록하러 가기"
              onPress={() => {}}
            />
          </div>
        ) : (
          <ReservationCalendar
            monthDate={monthDate}
            onPrevMonth={() => {
              setMonthDate(
                (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
              );
            }}
            onNextMonth={() => {
              setMonthDate(
                (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
              );
            }}
            renderTop={renderTop}
            getItemsForDate={getItemsForDate}
            renderItem={renderItem}
            onClickDate={(dateKey) => {
              // 날짜 클릭 시 상세 보기 원하면 여기서 모달/라우팅 처리
              console.log("clicked:", dateKey);
            }}
          />
        )}
      </div>

      <ReservationDetailModal
        visible={detailModal.visible}
        reservation={detailModal.reservation}
        onClose={() => setDetailModal({ visible: false, reservation: null })}
        setErrorModal={setErrorModal}
      />
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
    </div>
  );
}
