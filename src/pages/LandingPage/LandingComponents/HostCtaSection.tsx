import React from "react";
import { Button } from "../../../components/ui/button";
import { Apple, Play } from "lucide-react";

export function HostCtaSection() {
  return (
    <section id="hosts" className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-32 relative overflow-hidden border-t border-border/40">
      {/* Decorative Blur Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* App Icon Logo */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-white border border-border/50 shadow-xl shadow-primary/10 flex items-center justify-center mb-8 overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <img src="/images/ddakji-partner-logo.jpg" alt="게딱지 앱 로고" width={128} height={128} className="w-full h-full object-contain p-1.5" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
          언제 어디서나 간편하게,
          <br className="hidden md:block" />
          <span className="text-primary"> 게딱지 앱</span>으로 운영하세요
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 md:mb-14 max-w-2xl leading-relaxed">
          웹페이지뿐만 아니라 모바일에서도 강력한 호스트 기능을 완벽하게 지원합니다!
          스마트폰 하나로 예약부터 스탭 관리까지 한 번에 끝내세요.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] justify-center">
          <Button variant="outline" className="h-14 md:h-16 w-full flex-1 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-white hover:text-primary transition-all border-border/80" asChild>
            <a href="https://apps.apple.com/kr/app/%EA%B2%8C%EB%94%B1%EC%A7%80-%ED%8C%8C%ED%8A%B8%EB%84%88%EC%84%BC%ED%84%B0/id6761244097" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-3 px-6 w-full h-full">
              <Apple className="w-6 h-6 md:w-7 md:h-7 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] md:text-xs uppercase tracking-wider font-semibold opacity-70 leading-none">Download</span>
                <span className="text-sm md:text-base font-bold leading-tight">App Store</span>
              </div>
            </a>
          </Button>
          
          <Button variant="outline" className="h-14 md:h-16 w-full flex-1 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-white hover:text-primary transition-all border-border/80" asChild>
            <a href="https://play.google.com/store/apps/details?id=com.triofrontendapp" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center gap-3 px-6 w-full h-full text-foreground hover:text-primary">
              <Play className="w-6 h-6 md:w-7 md:h-7 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] md:text-xs uppercase tracking-wider font-semibold opacity-70 leading-none">Get it on</span>
                <span className="text-sm md:text-base font-bold leading-tight">Google Play</span>
              </div>
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
