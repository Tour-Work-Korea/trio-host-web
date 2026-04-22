import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@stores/userStore";
import { logout } from "@utils/authFlow";
import { Button } from "../ui/button"; // Corrected relative path
import { Menu, X } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const accessToken = useUserStore((s) => s.accessToken);
  const isLoggedIn = !!accessToken;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = useCallback(async () => {
    try {
      await logout();
    } catch (_) {
      // 서버 에러여도 클라이언트 상태는 정리
    } finally {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full">
      <nav className="container mx-auto sm:px-[40px] px-4 max-w-[1440px]">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Navigation - Grouped on the Left */}
          <div className="flex items-center gap-8 lg:gap-12">
            <a href="/" className="flex items-center" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <img
                src="/images/logo.png"
                alt="게딱지 로고"
                width={160}
                height={40}
                className="h-7 md:h-8 w-auto object-contain cursor-pointer"
              />
            </a>

            {/* Desktop Navigation - Cleaned up to only show App Download */}
            <div className="hidden md:flex items-center gap-6">
              {/* Optional secondary anchor if needed, but we keep it clean */}
            </div>
          </div>

          {/* CTA & Mobile Menu Group - Always visible on the Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex border-border/60 hover:bg-muted/50 font-semibold" asChild>
              <a href="/#hosts">앱 다운로드</a>
            </Button>
            {isLoggedIn ? (
              <>
                <Button size="sm" className="hidden sm:inline-flex bg-[#5361DB] text-white hover:bg-[#5361DB]/90 font-bold shadow-md shadow-[#5361DB]/30" onClick={() => navigate("/guesthouse/my")}>
                  사장님 페이지
                </Button>
                <Button size="sm" variant="outline" className="hidden sm:inline-flex border-[#5361DB]/50 text-[#5361DB] hover:text-[#5361DB] hover:bg-[#5361DB]/10 font-semibold" onClick={onLogout}>
                  로그아웃
                </Button>
                {/* Mobile version for logged in */}
                <Button size="sm" className="sm:hidden bg-[#5361DB] text-white hover:bg-[#5361DB]/90 font-bold px-3" onClick={() => navigate("/guesthouse/my")}>
                  My
                </Button>
              </>
            ) : (
              <Button size="sm" className="px-4 sm:px-6 font-bold bg-[#5361DB] text-white hover:bg-[#5361DB]/90 shadow-md shadow-[#5361DB]/30" onClick={() => navigate("/login")}>
                로그인
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 text-foreground hover:bg-muted/50 rounded-md transition-colors ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="/#hosts" className="text-sm font-bold text-foreground hover:text-primary transition-colors px-2" onClick={() => setMobileMenuOpen(false)}>
                앱 다운로드
              </a>
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Button size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate("/guesthouse/my"); }}>
                      사장님 페이지
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); onLogout(); }}>
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}>
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
