import React from "react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";

export function HeroSection({ handleRegisterModal }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/3 to-background pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Content - Centered */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            게스트하우스 특화 운영 플랫폼
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            호스트님의 시간,
            <br />
            게딱지 하나로 <span className="text-primary">'딱'</span> 벌어 드릴게요
          </h1>

          {/* Subheadline */}
          <p className="mb-8 mx-auto max-w-xl text-pretty text-base sm:text-lg text-muted-foreground md:text-xl">
            운영은 게딱지에 맡기고,
            호스트님은 게스트에게만 집중하세요.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12 relative z-20">
            <Button
              size="lg"
              className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              onClick={handleRegisterModal}
            >
              지금 바로, 게딱지 파트너 되기
            </Button>
          </div>
        </motion.div>

        {/* Phone Mockup - Centered at Bottom */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          {/* Glow Effect Behind Phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />

          {/* Floating Phone Wrapper */}
          <motion.div
            className="relative"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            {/* Phone Frame - Thinner, lighter border */}
            <div className="relative z-10 rounded-[2rem] md:rounded-[2.5rem] bg-gray-200 p-1.5 md:p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] bg-white">
                {/* Dynamic Island */}
                <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 z-20 h-5 w-20 md:h-6 md:w-24 bg-gray-900 rounded-full" />
                {/* Screen */}
                <img
                  src="/images/recommend.svg"
                  alt="게딱지 앱 화면"
                  width={300}
                  height={650}
                  className="w-[240px] md:w-[300px] h-auto"
                />
              </div>
            </div>

            {/* Shadow under phone */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 rounded-full blur-xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
