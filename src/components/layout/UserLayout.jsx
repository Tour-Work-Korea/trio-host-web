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
      <main className="flex flex-grow min-h-screen w-full md:px-20 lg:px-40 py-32 md:gap-12 lg:gap-20">
        <div className="w-auto">
          <MenuBar />
        </div>

        <Outlet />
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}
