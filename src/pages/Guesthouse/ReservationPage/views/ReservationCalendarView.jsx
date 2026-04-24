import React, { useState, useEffect, useMemo } from "react";
import guesthouseApi from "@api/guesthouseApi";
import EmptyComponent from "@components/EmptyComponent";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pad2 = (n) => String(n).padStart(2, "0");
const toYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export default function ReservationCalendarView({ guesthouseId }) {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  // Month Range for API (fetch the whole month's reservations)
  const monthRange = useMemo(() => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    return { startDate: toYMD(start), endDate: toYMD(end) };
  }, [monthDate]);

  const fetchMonthReservations = async () => {
    setLoading(true);
    try {
      const res = await guesthouseApi.searchGuesthouseReservations({
        guesthouseId,
        startDate: monthRange.startDate,
        endDate: monthRange.endDate,
        size: 500, // Fetch all for the month
      });
      const data = res?.data?.content || res?.content || [];
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn("캘린더 예약 목록 조회 실패:", error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthReservations();
    // eslint-disable-next-line
  }, [monthRange, guesthouseId]);

  // 달력 구조 생성 로직
  const calendarDays = useMemo(() => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const days = [];
    // 빈 셀 (이전 달력 보충)
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    // 이번 달 요일
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(y, m, i));
    }
    return days;
  }, [monthDate]);

  // 상태 배지 렌더링 헬퍼
  const renderBadge = (status) => {
    if (status === "CANCELLED") return <span className="px-3 py-1 bg-red-50 text-red-500 font-bold text-sm rounded-lg border border-red-100 whitespace-nowrap shadow-sm">예약 취소</span>;
    if (status === "CONFIRMED") return <span className="px-3 py-1 bg-primary-orange text-white font-bold text-sm rounded-lg border border-orange-500 whitespace-nowrap shadow-sm">예약 확정</span>;
    if (status === "PENDING") return <span className="px-3 py-1 bg-grayscale-100 text-grayscale-600 font-bold text-sm rounded-lg whitespace-nowrap shadow-sm">결제 대기</span>;
    if (status === "COMPLETED") return <span className="px-3 py-1 bg-blue-50 text-blue-500 font-bold text-sm rounded-lg border border-blue-100 whitespace-nowrap shadow-sm">이용 완료</span>;
    return <span className="px-3 py-1 bg-grayscale-100 text-grayscale-600 font-bold text-sm rounded-lg whitespace-nowrap shadow-sm">{status}</span>;
  };

  // 특정 날짜에 해당하는 예약 리스트 추출
  const getReservationsForDate = (date) => {
    if (!date) return [];
    const dateStr = toYMD(date);
    return reservations.filter(r => r.checkInDate <= dateStr && r.checkOutDate > dateStr);
  };

  const selectedDateStr = toYMD(selectedDate);
  const selectedReservations = getReservationsForDate(selectedDate);

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300 pb-20">
      
      {/* Calendar View */}
      <div className="bg-white rounded-3xl border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] px-6 py-8 mx-auto xl:w-2/3">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <button 
            onClick={() => setMonthDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="p-2 text-primary-orange hover:bg-orange-50 rounded-xl transition"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <span className="text-2xl font-bold tracking-tight text-grayscale-800">
            {monthDate.getFullYear()}.{String(monthDate.getMonth() + 1).padStart(2, "0")}
          </span>
          <button 
            onClick={() => setMonthDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="p-2 text-primary-orange hover:bg-orange-50 rounded-xl transition"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center mb-6 font-bold text-grayscale-400">
          {["일", "월", "화", "수", "목", "금", "토"].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 text-center gap-y-4">
          {calendarDays.map((d, idx) => {
            if (!d) return <div key={idx} className="p-4" />;
            const isSelected = toYMD(d) === selectedDateStr;
            const hasReservation = getReservationsForDate(d).length > 0;
            const isToday = toYMD(d) === toYMD(new Date());

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDate(d)}
                className="flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300
                  ${isSelected ? "bg-primary-orange text-white shadow-md transform scale-110" : "text-grayscale-900 group-hover:bg-grayscale-100"}
                  ${isToday && !isSelected ? "border-2 border-primary-orange text-primary-orange" : ""}
                `}>
                  {d.getDate()}
                </div>
                {/* Dot Indicator */}
                <div className="h-2 w-full flex items-center justify-center mt-1">
                  {hasReservation && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-orange' : 'bg-grayscale-300 group-hover:bg-primary-orange transition-colors'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Reservations */}
      <div className="xl:w-2/3 mx-auto space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight text-grayscale-900">
          {selectedDateStr.replace(/-/g, ".")} {["일", "월", "화", "수", "목", "금", "토"][selectedDate.getDay()]}
        </h3>

        {loading ? (
            <div className="py-4 text-center text-grayscale-400 font-semibold bg-grayscale-50 rounded-2xl border border-grayscale-100">동기화 중...</div>
        ) : selectedReservations.length === 0 ? (
          <div className="py-10 text-center text-grayscale-400 font-semibold bg-grayscale-50 rounded-2xl border border-grayscale-100">
            예약 내역이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {selectedReservations.map((r, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-grayscale-200 shadow-sm hover:border-primary-orange/30 transition-all cursor-pointer">
                {renderBadge(r.status)}
                <div className="flex flex-col flex-1">
                   <div className="font-bold text-lg text-grayscale-900 leading-tight">{r.roomName}</div>
                   <div className="font-semibold text-grayscale-500 text-sm mt-1">{r.checkInDate} ~ {r.checkOutDate} ({r.guestCount}인)</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
