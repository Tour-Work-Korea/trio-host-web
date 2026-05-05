import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@stores/userStore";
import useGuesthouseStore from "@stores/guesthouseStore";
import { useGuesthouseProfiles } from "@profile/useGuesthouseProfiles";
import { 
  ChevronDown, 
  Plus, 
  Settings, 
  LayoutDashboard, 
  Info, 
  CalendarCheck, 
  MessageSquare, 
  Users, 
  Building2,
  PartyPopper,
  CalendarDays
} from "lucide-react";

export default function MenuBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // 사용자 상태
  const profile = useUserStore((s) => s.profile);

  // 게스트하우스 상태 확인
  const { guesthouseProfiles } = useGuesthouseProfiles();
  const activeGuesthouses = guesthouseProfiles.filter(p => p.isApproved);
  
  const activeGuesthouseId = useGuesthouseStore((s) => s.activeGuesthouseId);
  const setActiveGuesthouseId = useGuesthouseStore(
    (s) => s.setActiveGuesthouseId
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeGuesthouse = activeGuesthouses.find(
    (g) => String(g.guesthouseId) === String(activeGuesthouseId)
  );

  const isActivePath = (to) => pathname === to || pathname.startsWith(to + "/");

  // 메인 카테고리 구성
  const globalNavLinks = [
    { to: "/guesthouse/dashboard", label: "대시보드", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/guesthouse/my", label: "게하 정보", icon: <Info className="w-4 h-4" /> },
    { to: "/reservation", label: "객실 예약", icon: <CalendarCheck className="w-4 h-4" /> },
    { to: "/party/info", label: "파티 정보", icon: <PartyPopper className="w-4 h-4" /> },
    { to: "/party/reservation", label: "파티 예약", icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const employNavLinks = [
    { to: "/employ/my-recruit", label: "스탭", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full text-grayscale-600">
      {/* 1. 글로벌 게스트하우스 스위처 */}
      <div className="px-4 py-3 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 w-full hover:bg-grayscale-50 p-2 border border-transparent hover:border-grayscale-100/50 rounded-xl transition-all text-left"
        >
          {activeGuesthouse ? (
            <>
              {activeGuesthouse.photoUrl ? (
                <img
                  src={activeGuesthouse.photoUrl}
                  alt={activeGuesthouse.name}
                  className="w-10 h-10 rounded-full object-cover bg-grayscale-100 border border-grayscale-200 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-grayscale-100 flex items-center justify-center font-bold text-grayscale-600 border border-grayscale-200 shadow-sm">
                  {activeGuesthouse.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="text-grayscale-900 font-extrabold tracking-tight truncate text-[15px]">
                  {activeGuesthouse.name || "이름 없는 업체"}
                </p>
                <p className="text-[11px] text-grayscale-400 font-medium truncate mt-0.5">
                  내 업체 관리
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-grayscale-400" />
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-grayscale-50 font-bold flex items-center justify-center text-grayscale-400 text-sm border border-grayscale-200 shadow-sm">
                +
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-grayscale-900 font-extrabold truncate text-[15px]">업체 추가하기</p>
              </div>
            </>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute top-[70px] left-4 right-4 bg-white border border-grayscale-200 shadow-xl rounded-xl overflow-hidden z-50">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {activeGuesthouses.length > 0 ? (
                activeGuesthouses.map((g) => {
                  const gId = String(g.guesthouseId);
                  const isSelected = String(activeGuesthouseId) === gId;
                  return (
                    <button
                      key={gId}
                      onClick={() => {
                        setActiveGuesthouseId(gId);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[15px] transition-colors border-b border-grayscale-100 last:border-b-0 hover:bg-grayscale-50 ${isSelected ? "text-grayscale-900 font-extrabold bg-grayscale-50" : "text-grayscale-600 font-medium"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-orange inline-block" />}
                        <span className="truncate">{g.name}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-grayscale-400 font-medium">
                  등록된 게스트하우스가 없습니다.
                </div>
              )}
            </div>
            <div className="p-2 border-t border-grayscale-200 bg-grayscale-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/guesthouse/store-register-form");
                }}
                className="flex items-center justify-center gap-2 w-full py-2 bg-primary-blue hover:bg-primary-blue/90 text-white rounded-lg text-[15px] font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                새 게스트하우스 등록
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 my-2 border-b border-grayscale-100/60" />

      {/* 2. 네비게이션 트리 */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        
        {/* 전체 매장 보기 (홈) 분리 버튼 */}
        <div className="mb-4 space-y-1">
          <NavLink
            to="/portal"
            state={{ preventAutoRedirect: true }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-extrabold transition-all border ${
                isActive
                  ? "bg-grayscale-800 text-white border-grayscale-800 shadow-md"
                  : "bg-white text-grayscale-500 border border-grayscale-200 shadow-sm hover:bg-grayscale-50 hover:text-grayscale-900"
              }`
            }
          >
            <span className="flex items-center justify-center w-5 h-5"><Building2 className="w-4 h-4" /></span>
            모든 내 업체 보기
          </NavLink>
        </div>

        <nav className="space-y-1">
          {globalNavLinks.map((link) => {
            const active = isActivePath(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                state={link.state}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all ${active
                    ? "bg-primary-blue text-white font-bold shadow-md shadow-primary-blue/20"
                    : "text-grayscale-500 hover:text-grayscale-900 hover:bg-grayscale-100"
                  }`}
              >
                <span className="flex items-center justify-center w-5 h-5">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}

          {employNavLinks.map((link) => {
            const active = isActivePath(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all ${active
                    ? "bg-primary-blue text-white font-bold shadow-md shadow-primary-blue/20"
                    : "text-grayscale-500 hover:text-grayscale-900 hover:bg-grayscale-100"
                  }`}
              >
                <span className="flex items-center justify-center w-5 h-5">{link.icon}</span>
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. 하단 유틸리티 영역 */}
      <div className="p-4 border-t border-grayscale-100 space-y-3 bg-grayscale-50 rounded-b-3xl">
        <div className="flex items-center justify-between px-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-blue text-white flex items-center justify-center font-extrabold text-[13px] shadow-sm shadow-primary-blue/30">
              {profile.name ? profile.name.charAt(0) : "사"}
            </div>
            <div className="text-grayscale-800 font-extrabold tracking-tight">{profile.name} <span className="font-semibold text-grayscale-500">사장님</span></div>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-xl bg-white border border-grayscale-200 hover:border-primary-orange hover:text-primary-orange hover:shadow-sm text-grayscale-400 transition-all"
            title="계정 설정"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
