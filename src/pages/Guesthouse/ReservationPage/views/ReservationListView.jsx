import React, { useState, useEffect } from "react";
import guesthouseApi from "@api/guesthouseApi";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import EmptyComponent from "@components/EmptyComponent";

export default function ReservationListView({ guesthouseId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [keyword, setKeyword] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 날짜 포맷 (예: 2026.04.23 (목))
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const day = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${y}.${m}.${d} (${day})`;
  };

  const getApiDateString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const dateStr = getApiDateString(currentDate);
      const res = await guesthouseApi.searchGuesthouseReservations({
        guesthouseId,
        startDate: dateStr,
        endDate: dateStr,
        keyword: keyword || undefined,
        size: 50,
      });
      const data = res?.data?.content || res?.content || [];
      // (테스트 시 API 값이 배열이 아닐 수 있으므로 오류방지)
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("예약 목록 조회 실패", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, [currentDate, guesthouseId]);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };
  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const searchSubmit = (e) => {
    if (e.key === "Enter") fetchReservations();
  };

  // 상태 배지 렌더링 헬퍼
  const getStatusBadge = (status) => {
    if (status === "CANCELLED") return <span className="w-16 h-16 rounded-full bg-red-50 text-red-500 font-bold flex items-center justify-center text-lg shadow-sm border border-red-100 shrink-0">취소</span>;
    if (status === "CONFIRMED") return <span className="w-16 h-16 rounded-full bg-primary-orange text-white font-bold flex items-center justify-center text-lg shadow-sm border border-orange-500 shrink-0">확정</span>;
    if (status === "PENDING") return <span className="w-16 h-16 rounded-full bg-grayscale-100 text-grayscale-600 font-bold flex items-center justify-center text-lg shadow-sm shrink-0">대기</span>;
    if (status === "COMPLETED") return <span className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 font-bold flex items-center justify-center text-lg shadow-sm border border-blue-100 shrink-0">완료</span>;
    return <span className="w-16 h-16 rounded-full bg-grayscale-100 text-grayscale-600 font-bold flex items-center justify-center text-lg shadow-sm">{status}</span>;
  };

  const getKoreanStatus = (status) => {
    if (status === "CANCELLED") return "환불";
    if (status === "PENDING") return "결제 대기";
    return "결제 완료";
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Date Navigation */}
      <div className="flex items-center justify-between border border-grayscale-200 rounded-2xl p-4 bg-white shadow-sm">
        <button onClick={handlePrevDay} className="p-2 hover:bg-grayscale-100 rounded-xl transition">
          <ChevronLeft className="w-6 h-6 text-grayscale-800" />
        </button>
        <span className="text-xl font-bold tracking-tight">{formatDate(currentDate)}</span>
        <button onClick={handleNextDay} className="p-2 hover:bg-grayscale-100 rounded-xl transition">
          <ChevronRight className="w-6 h-6 text-grayscale-800" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center bg-white border border-grayscale-200 rounded-xl px-4 py-2.5 focus-within:border-primary-orange focus-within:ring-2 focus-within:ring-primary-orange/20 transition-all shadow-sm">
          <select className="bg-transparent border-none outline-none font-semibold text-grayscale-700 pr-3 border-r border-grayscale-200">
            <option>예약자명</option>
          </select>
          <input 
            type="text" 
            placeholder="입력 후 검색하세요" 
            className="flex-1 bg-transparent border-none outline-none pl-4 text-grayscale-900 font-medium placeholder-grayscale-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={searchSubmit}
          />
          <Search className="w-5 h-5 text-grayscale-400 cursor-pointer" onClick={fetchReservations} />
        </div>
      </div>
      
      {/* List Header */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b-2 border-grayscale-900">
        <h2 className="text-xl font-bold tracking-tight">
          예약 <span className="text-primary-orange">{reservations.length}</span>건
        </h2>
      </div>

      {/* Reservation Cards */}
      {loading ? (
        <div className="h-40 flex items-center justify-center font-semibold text-grayscale-400">불러오는 중...</div>
      ) : reservations.length === 0 ? (
        <EmptyComponent title="오늘 예약내역이 없습니다." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {reservations.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-grayscale-200 p-6 flex flex-col gap-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-grayscale-300 transition-all">
              
              {/* Header: Badge + Profile */}
              <div className="flex items-center gap-5 border-b border-grayscale-100 pb-5">
                {getStatusBadge(item.status)}
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-extrabold tracking-tight">{item.userName || "예약자 정보 없음"}</span>
                  <span className="text-sm font-semibold text-grayscale-400">완료 0, 취소 0</span> {/* API 확장에 따라 연결 */}
                </div>
              </div>

              {/* Detail Rows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">예약자</span>
                  <span className="font-bold text-grayscale-900">{item.userName || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">나이</span>
                  <span className="font-bold text-grayscale-900">정보 없음</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">전화번호</span>
                  <span className="font-bold text-grayscale-900">{item.userPhone || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">예약번호</span>
                  <span className="font-bold text-grayscale-900 text-sm">{item.reservationId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">인원수</span>
                  <span className="font-bold text-grayscale-900">{item.guestCount || 1}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">객실</span>
                  <span className="font-bold text-primary-orange">{item.roomName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">이용기간</span>
                  <span className="font-bold text-primary-orange">{item.checkInDate} ~ {item.checkOutDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grayscale-500 font-medium">결제상태</span>
                  <span className="font-bold text-primary-orange">{getKoreanStatus(item.status)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
