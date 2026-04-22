import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const partners = [
  { name: "서점숙소", image: "/images/partners/seojeom.jpg" },
  { name: "점보네 게스트하우스", image: "/images/partners/jumbo.jpg" },
  { name: "리틀포레스트", image: "/images/partners/littleforest.jpg" },
  { name: "제철주택", image: "/images/partners/jecheol.jpg" },
  { name: "노마드인제주", image: "/images/partners/nomad.jpg" },
  { name: "소담소담", image: "/images/partners/sodam.jpg" },
  { name: "131 게스트하우스", image: "/images/partners/131.jpg" },
  { name: "이호웨이브", image: "/images/partners/ihowave.jpg" },
  { name: "히든스테이", image: "/images/partners/hiddenstay.jpg" },
  { name: "524 게스트하우스", image: "/images/partners/524.jpg" },
  { name: "협재옹포리", image: "/images/partners/hyeopjae.jpg" },
  { name: "제주공항 가까운", image: "/images/partners/jejuairport.jpg" },
  { name: "구구호스텔", image: "/images/partners/gugu.jpg" },
  { name: "미조 게스트하우스", image: "/images/partners/mijo.jpg" },
  { name: "김녕기억", image: "/images/partners/gimnyeong.jpg" },
  { name: "백패커스홈", image: "/images/partners/backpackers.jpg" },
];

export function PartnersSection() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const speed = 0.5;

    const scroll = () => {
      scrollPosition += speed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section id="partners" className="border-y border-border bg-card overflow-hidden">
      <motion.div 
        className="py-16 md:py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-8 mb-6">
          <p className="text-center text-base md:text-lg font-medium text-muted-foreground">
            게딱지와 함께하는 게스트하우스
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-hidden whitespace-nowrap"
        >
          {/* 두 번 반복해서 무한 스크롤 효과 */}
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="group flex-shrink-0 flex items-center gap-3 px-2 py-2 pr-6 rounded-full bg-white dark:bg-card text-foreground font-medium text-sm md:text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <img
                  src={partner.image}
                  alt={`${partner.name} 로고`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
