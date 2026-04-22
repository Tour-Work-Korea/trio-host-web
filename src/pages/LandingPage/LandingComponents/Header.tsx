import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Menu, X } from "lucide-react";

export function Header({ handleRegisterModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="게딱지 로고"
              width={160}
              height={40}
              className="h-7 md:h-8 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              서비스 소개
            </a>
            <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              이용 후기
            </a>
            <a href="#partners" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              파트너
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Button size="sm" onClick={handleRegisterModal}>
              입점 문의
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                서비스 소개
              </a>
              <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                이용 후기
              </a>
              <a href="#partners" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                파트너
              </a>
              <div className="pt-4 border-t border-border">
                <Button size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); handleRegisterModal(); }}>
                  입점 문의
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
