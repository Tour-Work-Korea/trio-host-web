import React from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import { useGuesthouseProfiles } from "@profile/useGuesthouseProfiles";
import { ChevronRight, TrendingUp, AlertCircle, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InactiveGuard from "@components/InactiveGuard";

export default function HostDashboardPage() {
  const { activeGuesthouseId } = useGuesthouseStore();
  const { guesthouseProfiles } = useGuesthouseProfiles();
  const navigate = useNavigate();

  const activeGh = guesthouseProfiles.find((g) => String(g.guesthouseId) === String(activeGuesthouseId));

  if (!activeGuesthouseId || !activeGh) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
        <h2 className="text-xl font-bold text-grayscale-800 mb-2">업체를 선택해주세요</h2>
        <p className="text-grayscale-500 mb-6">좌측 사이드바 상단에서 대시보드를 확인할 업체를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full text-grayscale-900 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-2 text-sm text-grayscale-500 font-semibold mb-2">
        <span>대시보드</span> <ChevronRight className="w-4 h-4" /> <span className="text-primary-blue">{activeGh.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue">
            🏠
          </span>
          {activeGh.name} 대시보드
        </h1>
      </div>

      <InactiveGuard>
      {/* 상단 1: 마케팅 배너 / 공지사항 연결 */}
      <div 
        onClick={() => navigate("/guesthouse/notices")} 
        className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-4 border border-pink-100 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-pink-100 text-pink-600 font-bold text-xs rounded-full shadow-sm">마케팅</span>
          <span className="font-bold text-grayscale-800 tracking-tight group-hover:text-pink-600 transition-colors">무료 인스타 피드 제작 지원 안내</span>
        </div>
        <ChevronRight className="w-5 h-5 text-grayscale-400 group-hover:text-pink-500 transition-colors" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 예약 현황 */}
        <div className="bg-white rounded-2xl p-6 border border-grayscale-200 shadow-sm col-span-1 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-primary-blue" />
              예약 현황
            </h2>
          </div>
          
          <div className="grid grid-cols-4 divide-x divide-grayscale-100 text-center">
            <div className="flex flex-col items-center justify-center py-2 hover:bg-grayscale-50 rounded-xl transition cursor-pointer">
              <span className="text-3xl font-bold text-grayscale-800">0</span>
              <span className="text-xs text-grayscale-500 font-medium mt-2">확정 대기</span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 hover:bg-grayscale-50 rounded-xl transition cursor-pointer">
              <span className="text-3xl font-bold text-primary-blue">0</span>
              <span className="text-xs text-grayscale-900 font-bold mt-2">오늘 확정</span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 hover:bg-grayscale-50 rounded-xl transition cursor-pointer">
              <span className="text-3xl font-bold text-grayscale-800">0</span>
              <span className="text-xs text-grayscale-500 font-medium mt-2">오늘 이용</span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 hover:bg-grayscale-50 rounded-xl transition cursor-pointer">
              <span className="text-3xl font-bold text-red-500">0</span>
              <span className="text-xs text-grayscale-500 font-medium mt-2">오늘 취소</span>
            </div>
          </div>
        </div>

        {/* 매출 분석 */}
        <div onClick={() => navigate("/guesthouse/sales")} className="bg-white rounded-2xl p-6 border border-grayscale-200 shadow-sm cursor-pointer hover:shadow-md transition">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-orange" />
              매출 분석
            </h2>
            <ChevronRight className="w-5 h-5 text-grayscale-400" />
          </div>

          <div className="mb-6 border-b border-grayscale-100 pb-6">
            <div className="flex items-center gap-1 text-sm text-grayscale-500 font-medium mb-1">
              이번 달 순매출 <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div className="text-3xl font-extrabold tracking-tight">24,800,000 <span className="text-lg font-bold">원</span></div>
            <div className="text-sm font-semibold mt-1">이전기간대비 <span className="text-red-500">+3,794,400</span></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-grayscale-500 font-medium">전체 매출</span>
              <span className="font-bold text-grayscale-900">26,500,000원</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-grayscale-500 font-medium">취소/노쇼</span>
              <span className="font-bold text-grayscale-900">-1,700,000원</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-grayscale-500 font-medium">취소수수료</span>
              <span className="font-bold text-grayscale-900">+0원</span>
            </div>
          </div>
        </div>

        {/* 정산 관리 */}
        <div className="bg-white rounded-2xl p-6 border border-grayscale-200 shadow-sm cursor-pointer hover:shadow-md transition">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">₩</span>
              정산 관리
            </h2>
            <ChevronRight className="w-5 h-5 text-grayscale-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-grayscale-50 p-4 rounded-xl border border-grayscale-100">
              <div className="text-xs font-semibold text-grayscale-500 mb-2">4월 입금 예정</div>
              <div className="text-xl font-bold text-primary-blue flex flex-col">148,764<span className="text-sm">원</span></div>
            </div>
            <div className="bg-grayscale-50 p-4 rounded-xl border border-grayscale-100">
              <div className="text-xs font-semibold text-grayscale-500 mb-2">4월 누적 정산액</div>
              <div className="text-xl font-bold text-grayscale-900 flex flex-col">195,132<span className="text-sm">원</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-grayscale-100 flex flex-col justify-end">
              <div className="text-xs font-semibold text-grayscale-500 mb-1">총 매출액 (부가세 포함)</div>
              <div className="text-lg font-bold">202,000원</div>
            </div>
            <div className="p-4 rounded-xl border border-grayscale-100 flex flex-col justify-end">
              <div className="text-xs font-semibold text-grayscale-500 mb-1">수수료 (3.4%)</div>
              <div className="text-lg font-bold">6,868원</div>
            </div>
          </div>
        </div>

      </div>
      </InactiveGuard>
    </div>
  );
}
