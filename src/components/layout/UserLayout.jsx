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
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <header className="w-full z-10 fixed">
        <Header />
      </header>

      <main className="pt-24">
        {" "}
        {/* 헤더 높이만큼 여유 */}
        {/* 사이드바 토글 버튼 */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-grayscale-200 shadow-md px-1 py-1"
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

          <div className="flex-1 min-w-0 overflow-x-hidden">
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
