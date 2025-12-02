import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MenuBar from "./MenuBar";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <header className="w-full z-10 fixed">
        <Header />
      </header>
      <main className="flex flex-grow min-h-screen w-full px-12 xl:px-40 py-32 gap-12 lg:gap-20">
        <div className="w-64 flex-shrink-0">
          <MenuBar />
        </div>
        <div className="flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
