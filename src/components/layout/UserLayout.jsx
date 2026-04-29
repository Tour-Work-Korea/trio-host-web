import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MenuBar from "./MenuBar";
import { useState, useEffect } from "react";
import useGuesthouseStore from "@stores/guesthouseStore";

import ChevronRight from "@assets/images/chevron_right_gray.svg";
import ChevronLeft from "@assets/images/chevron_left_gray.svg";

export default function UserLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const fetchGuesthouses = useGuesthouseStore((s) => s.fetchGuesthouses);
  const guesthouses = useGuesthouseStore((s) => s.guesthouses);

  useEffect(() => {
    // 렌더링 시 전역으로 사용자의 게스트하우스 리스트를 로드 (컨텍스트 구성)
    const init = async () => {
      setLoading(true);
      await fetchGuesthouses();
      setLoading(false);
    };
    init();
  }, [fetchGuesthouses]);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-background items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (guesthouses.length === 0) {
    return <Navigate to="/portal" replace />;
  }

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

          {/* 대시보드 컨테이너 (그림자와 라운딩으로 프리미엄 룩 구현) */}
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
