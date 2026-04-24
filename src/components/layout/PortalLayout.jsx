import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PortalLayout() {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full overflow-x-hidden bg-[#F8F9FC] text-grayscale-900 font-sans selection:bg-primary-orange/20">
      <header className="bg-white border-b border-grayscale-100">
        <Header />
      </header>
      <main className="flex flex-grow flex-col w-full relative pt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
