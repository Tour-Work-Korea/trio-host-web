import React, { useState } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import { ChevronLeft, ChevronRight, HelpCircle, TrendingUp, Users, BadgePercent, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SalesAnalysisPage() {
  const { activeGuesthouseId, guesthouses } = useGuesthouseStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("count"); // count | guests

  const activeGh = guesthouses.find((g) => (g.guesthouseId || g.id) === activeGuesthouseId);

  if (!activeGuesthouseId || !activeGh) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <h2 className="text-xl font-bold">업체를 선택해주세요</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 1. Header & Month Selector */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-grayscale-800 cursor-pointer w-fit group" onClick={() => navigate(-1)}>
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition">
            <ChevronLeft className="w-5 h-5 text-grayscale-800" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">{activeGh.guesthouseName} <span className="text-primary-blue font-medium">통계</span></span>
        </div>

        <div className="flex items-center justify-between bg-white rounded-2xl p-4 sm:p-6 border border-grayscale-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <button className="p-3 bg-grayscale-50 hover:bg-grayscale-100 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-grayscale-600" /></button>
          <span className="text-2xl font-extrabold tracking-tight text-grayscale-900">2026년 4월</span>
          <button className="p-3 bg-grayscale-50 hover:bg-grayscale-100 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-grayscale-600" /></button>
        </div>
      </div>

      {/* 2. 순매출 (Net Revenue) */}
      <div className="space-y-4 relative">
        <div className="absolute -inset-4 bg-gradient-to-b from-blue-50/50 to-transparent blur-3xl -z-10 rounded-3xl"></div>
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight"><CreditCard className="w-6 h-6 text-[#5361DB]" /> 순매출 <HelpCircle className="w-4 h-4 text-grayscale-400 cursor-help" /></h2>
          <button className="px-4 py-2 bg-white border border-grayscale-200 text-grayscale-700 rounded-full text-sm font-bold shadow-sm hover:bg-grayscale-50 transition">연간 보기</button>
        </div>

        <div className="bg-gradient-to-br from-white to-[#fbfbfe] rounded-3xl p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <div className="text-5xl font-extrabold tracking-tighter mb-2 text-grayscale-900 drop-shadow-sm">
              24,800,000 <span className="text-2xl font-bold text-grayscale-600 ml-1">원</span>
            </div>
            <div className="flex items-center gap-2 mb-10">
              <span className="text-grayscale-500 font-semibold bg-grayscale-100 px-3 py-1 rounded-full text-sm">이전기간대비</span>
              <span className="text-red-500 font-bold text-lg">+3,794,400</span>
            </div>

            <div className="grid gap-4 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-grayscale-100 border-dashed">
                <span className="text-grayscale-500 font-semibold">전체 매출</span>
                <span className="text-xl font-bold text-grayscale-900">26,500,000원</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-grayscale-100 border-dashed">
                <span className="text-grayscale-500 font-semibold">취소/노쇼</span>
                <span className="text-xl font-bold text-grayscale-900">-1,700,000원</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-grayscale-500 font-semibold">취소수수료</span>
                <span className="text-xl font-bold text-grayscale-900">+170,000원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 예약 지표 (Reservation Metrics) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight"><BadgePercent className="w-6 h-6 text-primary-orange" /> 예약 지표 <HelpCircle className="w-4 h-4 text-grayscale-400 cursor-help" /></h2>
          <div className="flex bg-grayscale-100/80 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("count")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "count" ? "bg-white text-grayscale-900 shadow-sm" : "text-grayscale-500 hover:text-grayscale-700"}`}
            >예약수</button>
            <button
              onClick={() => setActiveTab("guests")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "guests" ? "bg-white text-grayscale-900 shadow-sm" : "text-grayscale-500 hover:text-grayscale-700"}`}
            >예약자수</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "신청", count: 812, diffCount: "+61", diffPct: "+8.1%", color: "text-red-500", bg: "bg-red-50" },
            { label: "이용완료", count: 650, diffCount: "+41", diffPct: "+6.7%", color: "text-red-500", bg: "bg-red-50" },
            { label: "취소", count: 120, diffCount: "-25", diffPct: "-17.2%", color: "text-blue-500", bg: "bg-blue-50" },
            { label: "확정", count: 812, diffCount: "+61", diffPct: "+8.1%", color: "text-red-500", bg: "bg-red-50" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-grayscale-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform cursor-default">
              <div className="text-sm font-bold text-grayscale-500 mb-4 bg-grayscale-50 w-fit px-3 py-1 rounded-md">{item.label}</div>
              <div className="text-3xl font-extrabold tracking-tight mb-2 text-grayscale-900">{item.count}<span className="text-lg font-bold text-grayscale-500 ml-1">건</span></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-grayscale-400">{item.diffCount}</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>{item.diffPct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 고객분석 & 취소율 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 고객분석 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2"><Users className="w-5 h-5 text-purple-500" /> 고객분석 <HelpCircle className="w-4 h-4 text-grayscale-400" /></h2>
          
          <div className="bg-white rounded-3xl p-8 border border-grayscale-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full">
            <div className="flex justify-center items-center relative py-6 mb-4">
              <div className="w-48 h-24 overflow-hidden relative">
                <div className="w-48 h-48 rounded-full border-[24px] border-[#5361DB] border-r-[#F45B69] border-t-[#F45B69] rotate-45 shadow-inner"></div>
              </div>
              <div className="absolute left-6 text-center">
                <div className="text-2xl font-extrabold text-[#5361DB]">45%</div>
                <div className="text-sm font-bold text-grayscale-500">남자</div>
              </div>
              <div className="absolute right-6 text-center">
                <div className="text-2xl font-extrabold text-[#F45B69]">55%</div>
                <div className="text-sm font-bold text-grayscale-500">여자</div>
              </div>
            </div>

            <div className="space-y-4 px-2">
              {[
                { age: '10대', m: 10, f: 15 }, { age: '20대', m: 60, f: 55 }, { age: '30대', m: 30, f: 30 },
                { age: '40대', m: 0, f: 0 }, { age: '50대', m: 0, f: 0 }, { age: '60대', m: 0, f: 0 }, { age: '70대', m: 0, f: 0 },
              ].map((row) => (
                <div key={row.age} className="flex items-center justify-center relative h-6 group">
                  <div className="w-[45%] flex justify-end items-center gap-3 pr-6 border-r border-grayscale-200 h-full relative">
                    <span className={`text-sm font-bold ${row.m > 0 ? "text-[#5361DB]" : "text-transparent"}`}>{row.m}%</span>
                    <div className="w-24 bg-grayscale-50 rounded-full h-2.5 flex justify-end items-center overflow-hidden">
                       {row.m > 0 && <div className="h-full bg-[#5361DB] rounded-full" style={{ width: `${row.m}%` }}></div>}
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-grayscale-500 bg-white px-3 py-1 rounded-full group-hover:bg-grayscale-100 transition-colors">
                    {row.age}
                  </div>

                  <div className="w-[45%] flex justify-start items-center gap-3 pl-6 border-l border-grayscale-200 h-full relative">
                    <div className="w-24 bg-grayscale-50 rounded-full h-2.5 flex justify-start items-center overflow-hidden">
                       {row.f > 0 && <div className="h-full bg-[#F45B69] rounded-full" style={{ width: `${row.f}%` }}></div>}
                    </div>
                    <span className={`text-sm font-bold ${row.f > 0 ? "text-[#F45B69]" : "text-transparent"}`}>{row.f}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 취소율·취소주체 */}
        <div className="space-y-4 flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2"><TrendingUp className="w-5 h-5 text-red-500" /> 취소율 및 취소주체 <HelpCircle className="w-4 h-4 text-grayscale-400" /></h2>
          
          <div className="bg-white rounded-3xl p-8 border border-grayscale-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-6 flex-1">
            <div className="p-6 bg-gradient-to-br from-grayscale-50 to-white rounded-2xl border border-grayscale-100 flex flex-col">
              <div className="text-4xl font-extrabold tracking-tight mb-2 text-grayscale-900">15.1%</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-grayscale-500 bg-white px-2 py-1 rounded-md shadow-sm">이전기간대비</span> 
                <span className="text-[#5361DB] font-bold text-lg">-4.24%p</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 flex flex-col justify-end">
              <div className="bg-green-50/70 rounded-2xl relative overflow-hidden border border-green-100/50 p-5 flex justify-between items-center group hover:bg-green-50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-green-200/50 to-transparent w-[84%] transition-transform origin-left group-hover:scale-x-105"></div>
                <div className="relative z-10 flex items-center gap-4 text-green-700 font-bold">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-sm">1</span>
                  <span className="text-lg">예약자 취소</span>
                </div>
                <span className="relative z-10 text-xl text-green-700 font-extrabold tracking-tight">65회</span>
              </div>

              <div className="rounded-2xl relative overflow-hidden border border-grayscale-100 p-5 flex justify-between items-center group hover:bg-grayscale-50 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-grayscale-200/50 to-transparent w-[15%] transition-transform origin-left group-hover:scale-x-105"></div>
                <div className="relative z-10 flex items-center gap-4 text-grayscale-800 font-bold">
                  <span className="w-6 h-6 rounded-full bg-white border border-grayscale-200 flex items-center justify-center shadow-sm text-sm">2</span>
                  <span className="text-lg">사업자 취소</span>
                </div>
                <span className="relative z-10 text-xl text-grayscale-900 font-extrabold tracking-tight">12회</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 객실별 순매출 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 px-2 tracking-tight">객실별 순매출 <HelpCircle className="w-4 h-4 text-grayscale-400" /></h2>
        
        <div className="bg-white rounded-3xl p-8 border border-grayscale-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
          {[
            { rank: 1, name: "도미토리 A", amt: "11,200,000원", width: "80%", color: "text-green-700", bg: "bg-green-50/50 border-green-100/50", bar: "bg-gradient-to-r from-green-200/50 to-transparent" },
            { rank: 2, name: "도미토리 B", amt: "8,500,000원", width: "65%", color: "text-grayscale-800", bg: "border-grayscale-100 hover:bg-grayscale-50 transition-colors", bar: "bg-gradient-to-r from-grayscale-200/50 to-transparent" },
            { rank: 3, name: "프라이빗 룸 1", amt: "3,100,000원", width: "30%", color: "text-grayscale-800", bg: "border-grayscale-100 hover:bg-grayscale-50 transition-colors", bar: "bg-gradient-to-r from-grayscale-200/50 to-transparent" },
            { rank: 4, name: "프라이빗 룸 2", amt: "2,000,000원", width: "20%", color: "text-grayscale-800", bg: "border-grayscale-100 hover:bg-grayscale-50 transition-colors", bar: "bg-gradient-to-r from-grayscale-200/50 to-transparent" },
          ].map((r) => (
            <div key={r.rank} className={`rounded-2xl relative overflow-hidden border p-5 flex justify-between items-center group cursor-default ${r.bg}`}>
              <div className={`absolute left-0 top-0 bottom-0 ${r.bar} origin-left transition-transform group-hover:scale-x-105 duration-500`} style={{ width: r.width }}></div>
              <div className={`relative z-10 flex items-center gap-4 ${r.color} font-bold`}>
                <span className={`w-8 h-8 rounded-full ${r.rank === 1 ? 'bg-white shadow-sm' : 'bg-grayscale-100'} flex items-center justify-center text-sm`}>{r.rank}</span> 
                <span className="text-lg">{r.name}</span>
              </div>
              <span className={`relative z-10 text-xl tracking-tight ${r.rank === 1 ? 'font-extrabold' : 'font-bold'} ${r.color}`}>{r.amt}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
