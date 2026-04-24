import React from "react";

const footerLinks = {
  고객지원: [
    { label: "문의하기", href: "http://pf.kakao.com/_iLxiRX", external: true },
  ],
  약관: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card w-full mt-auto">
      <div className="container mx-auto px-6 py-12 lg:px-12 lg:py-16 max-w-[1440px]">
        {/* Footer Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Brand & Business Info */}
          <div className="lg:w-2/3">
            <a href="/" className="flex items-center gap-2 mb-6 w-fit">
              <img
                src="/images/icon.svg"
                alt="게딱지 로고"
                width={36}
                height={36}
                className="w-auto h-9 opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
            
            <p className="text-[15px] text-foreground font-bold mb-3">(주)워커웨이</p>
            <div className="text-[13px] text-muted-foreground space-y-2 leading-relaxed">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center"><strong className="font-semibold text-foreground mr-1.5">대표</strong> 이하늘, 정재원</span>
                <span className="opacity-30">|</span>
                <span className="flex items-center"><strong className="font-semibold text-foreground mr-1.5">사업자등록번호</strong> 888-25-02003</span>
                <span className="opacity-30">|</span>
                <span className="flex items-center"><strong className="font-semibold text-foreground mr-1.5">통신판매업신고</strong> 제2025-서울양천-0825호</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className="flex items-center"><strong className="font-semibold text-foreground mr-1.5">주소</strong> 제주시 연동 263-13 레지던스이타스3</span>
                <span className="opacity-30">|</span>
                <span className="flex items-center"><strong className="font-semibold text-foreground mr-1.5">고객센터</strong> 010-4123-0075</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16 lg:w-1/3 lg:justify-end mt-4 lg:mt-0">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="lg:ml-auto">
                <h3 className="mb-5 font-bold text-foreground">{category}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[14px] font-medium text-muted-foreground hover:text-foreground hover:font-semibold transition-all whitespace-nowrap"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <div className="text-[13px] font-medium text-muted-foreground">
            © 2025 게딱지. All rights reserved.
          </div>

          <a
            href="https://www.instagram.com/guesthouse_ddakji/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-muted-foreground bg-muted/30 hover:bg-muted/80 hover:text-foreground transition-all rounded-full border border-border/50 shadow-sm"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
