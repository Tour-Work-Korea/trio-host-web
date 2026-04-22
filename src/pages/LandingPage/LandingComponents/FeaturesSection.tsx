import React from "react";
import { Search, Filter, CheckCircle, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "게하 운영, 게딱지로 '딱'",
    description: "게스트하우스의 특성을 반영한 맞춤형 예약 시스템",
    className: "bg-primary/5 dark:bg-primary/10",
    imageBg: "bg-gradient-to-t from-primary/15 to-transparent dark:from-primary/20",
    imageUrl: "/images/guesthouse.png",
  },
  {
    icon: CheckCircle,
    title: "번거로운 안내, 이제는 자동화",
    description: "당일 입실 손님에게 필요한 정보를 잊지 않고 대신 전달해 드립니다",
    className: "bg-muted/40 dark:bg-muted/10",
    imageBg: "bg-gradient-to-t from-muted/60 to-transparent dark:from-muted/20",
    imageUrl: "/images/checkin.png",
  },
  {
    icon: PartyPopper,
    title: "파티 인원도 알아서 '딱'",
    description: "신청 현황 파악은 앱에게 맡기고, 더 즐거운 파티 분위기를 만들어보세요",
    className: "bg-muted/40 dark:bg-muted/10",
    imageBg: "bg-gradient-to-t from-muted/60 to-transparent dark:from-muted/20",
    imageUrl: "/images/contents.svg",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-10 md:mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-foreground md:text-4xl text-balance">
            왜 게딱지인가요?
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground px-4">
            게스트하우스를 찾는 여행자를 위해 설계된 플랫폼으로 더 재밌고, 편안한 여행을 경험하세요
          </p>
        </motion.div>

        {/* Features Vertical Layout */}
        <div className="flex flex-col gap-16 lg:gap-20 max-w-5xl mx-auto mt-16 md:mt-24 pb-8">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <motion.div
                key={index}
                className={`relative z-10 group flex flex-col items-center gap-8 md:gap-12 lg:gap-16 ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} ${index > 0 ? '-mt-4 lg:-mt-12' : ''}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              >
                {/* Text Area */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
                  <div className="mb-6 inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto lg:mx-0 shadow-sm border border-primary/20">
                    <feature.icon className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <h3 className="mb-2 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 whitespace-pre-line px-4 lg:px-0">
                    {feature.description}
                  </p>
                </div>

                {/* Smartphone App Screen Mockup Area */}
                <div className={`w-full lg:w-1/2 flex justify-center ${isReversed ? 'lg:justify-start' : 'lg:justify-end'} px-4 lg:px-0`}>
                  <div className="relative flex items-center justify-center w-full max-w-[200px] md:max-w-[250px]">
                    {/* Decorative Background Blob */}
                    <div className={`absolute inset-0 scale-[1.5] blur-3xl rounded-full opacity-60 ${feature.imageBg.replace('bg-gradient-to-t', 'bg-gradient-to-tr')}`} />

                    {/* Phone Container */}
                    <div className="relative z-10 w-full aspect-[9/19] rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-[4px] lg:border-[6px] border-white dark:border-zinc-800 bg-background overflow-hidden hover:-translate-y-3 transition-transform duration-700 ease-out">
                      {feature.imageUrl ? (
                        <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-background/95 dark:bg-card/95 pt-12 px-4 flex flex-col gap-4 relative">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/80 dark:bg-black rounded-full z-20" />
                          <div className="flex items-center gap-3 mt-4">
                            <div className="w-12 h-12 rounded-full bg-muted/80 animate-pulse" />
                            <div className="space-y-2">
                              <div className="w-20 h-2.5 bg-muted/80 rounded-full" />
                              <div className="w-12 h-2 bg-muted/50 rounded-full" />
                            </div>
                          </div>
                          <div className="w-full flex-1 bg-muted/30 rounded-2xl mb-6" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
