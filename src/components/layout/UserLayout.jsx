import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MenuBar from "./MenuBar";
import { useState } from "react";
import ChevronRight from "@assets/images/chevron_right_gray.svg";
import ChevronLeft from "@assets/images/chevron_left_gray.svg";

export default function UserLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-background text-grayscale-900 font-sans selection:bg-primary-orange/20">
      <header className="w-full z-50 fixed top-0 left-0 right-0">
        <Header />
      </header>

      <main className="pt-24">
        {/* 헤더 높이만큼 여유 */}
        {/* 사이드바 토글 버튼 */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-100 px-2 py-2 hover:scale-110 transition-all duration-300 active:scale-95"
        >
          <img
            src={sidebarVisible ? ChevronLeft : ChevronRight}
            width={28}
            height={28}
            alt="toggle sidebar"
          />
        </button>
        <div className="flex flex-grow min-h-screen w-full px-12 xl:px-40 py-8 gap-12 lg:gap-20">
          {sidebarVisible && (
            <div className="w-64 flex-shrink-0">
              <MenuBar />
            </div>
          )}

          <div className="flex-1 min-w-0 overflow-x-hidden scrollbar-hide">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
