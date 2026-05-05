import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MenuBar from "./MenuBar";
import { useState } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";
import { useGuesthouseProfiles } from "@profile/useGuesthouseProfiles";

import ChevronRight from "@assets/images/chevron_right_gray.svg";
import ChevronLeft from "@assets/images/chevron_left_gray.svg";

export default function UserLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const { guesthouseProfiles } = useGuesthouseProfiles();
  const activeGuesthouses = guesthouseProfiles.filter((p) => p.isApproved);
  const { activeGuesthouseId, guesthouses } = useGuesthouseStore();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  if (activeGuesthouses.length === 0) {
    return <Navigate to="/portal" replace />;
  }

  const activeGh = activeGuesthouses.find(
    (g) => String(g.guesthouseId) === String(activeGuesthouseId)
  );

  const isInactive = activeGh?.guesthouseStatus === "INACTIVE";

  const isFormPage = location.pathname.startsWith("/guesthouse/form");

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-background text-grayscale-900 font-sans selection:bg-primary-orange/20">
      <header className="w-full z-50 fixed top-0 left-0 right-0">
        <Header />
      </header>

      <main className="pt-24 pb-12 w-full flex-grow bg-background">
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-[40px] relative">
          {/* 사이드바 토글 버튼 */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute -left-3 top-10 z-40 rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-100 p-1.5 hover:scale-110 transition-all duration-300 active:scale-95"
          >
            <img
              src={sidebarVisible ? ChevronLeft : ChevronRight}
              width={20}
              height={20}
              alt="toggle sidebar"
            />
          </button>

          {/* 대시보드 컨테이너 */}
          <div className="flex min-h-[calc(100vh-8rem)] w-full relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-grayscale-100">
            {/* 밝은 사이드바 영역 */}
            {sidebarVisible && (
              <div className="w-[260px] flex-shrink-0 bg-white text-grayscale-800 pt-4 pb-12 z-20 shadow-sm border-r border-grayscale-100/50">
                <MenuBar />
              </div>
            )}

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 min-w-0 overflow-x-hidden bg-[#F8F9FC] p-8 lg:p-12 relative border-l border-grayscale-100">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
