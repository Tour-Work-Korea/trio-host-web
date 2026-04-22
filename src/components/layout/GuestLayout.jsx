import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function GuestLayout() {
  return (
    <div className="flex flex-col min-h-[100dvh] w-full overflow-x-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      <Header />
      <main className="flex flex-grow flex-col w-full relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
