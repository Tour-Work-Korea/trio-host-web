import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import useGuesthouseStore from "@stores/guesthouseStore";
import EmptyComponent from "@components/EmptyComponent";
import { useNavigate } from "react-router-dom";
import InactiveGuard from "@components/InactiveGuard";

// 뷰 컴포넌트들
import ReservationListView from "./views/ReservationListView";
import ReservationCalendarView from "./views/ReservationCalendarView";
import RoomManagementView from "./views/RoomManagementView";

export default function ReservationPage() {
  const navigate = useNavigate();
  const { guesthouses, activeGuesthouseId } = useGuesthouseStore();
  const [activeTab, setActiveTab] = useState("LIST"); // LIST | CALENDAR | ROOM 

  // 활성화된 게스트하우스 데이터
  const activeGh = guesthouses.find(
    (g) => String(g.guesthouseId || g.id) === String(activeGuesthouseId)
  );

  // 게스트하우스 선택이 안되어있을 경우 빈 화면 표시
  if (!activeGuesthouseId || !activeGh) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in">
        <EmptyComponent
          title="선택된 업체가 없습니다"
          subtitle="좌측 메뉴 상단에서 업체를 먼저 선택해주세요."
          buttonText="홈으로 돌아가기"
          onPress={() => navigate("/guesthouse/home")}
        />
      </div>
    );
  }

  const ghId = activeGh.guesthouseId || activeGh.id;

  return (
    <div className="max-w-4xl w-full mx-auto text-grayscale-900 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-2 text-sm text-grayscale-500 mb-6 font-semibold">
        <span>객실 예약</span> <ChevronRight className="w-4 h-4" />{" "}
        <span className="text-primary-blue">{activeGh.guesthouseName}</span>
      </div>

      {/* Top Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { id: "LIST", label: "예약 관리" },
          { id: "CALENDAR", label: "예약 캘린더" },
          { id: "ROOM", label: "방관리" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 font-bold text-sm transition-all rounded-full border shadow-sm ${
              activeTab === tab.id
                ? "border-primary-blue bg-primary-blue text-white"
                : "border-grayscale-200 bg-white text-grayscale-600 hover:bg-grayscale-50 hover:text-grayscale-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 영역 */}
      <InactiveGuard>
        <div>
          {activeTab === "LIST" && <ReservationListView guesthouseId={ghId} />}
          {activeTab === "CALENDAR" && <ReservationCalendarView guesthouseId={ghId} />}
          {activeTab === "ROOM" && <RoomManagementView guesthouseId={ghId} />}
        </div>
      </InactiveGuard>
    </div>
  );
}
