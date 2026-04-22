import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Handshake, Megaphone, Headset, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Handshake,
    title: "초기 파트너 자격",
    description: "서비스 방향에 직접 의견 반영",
  },
  {
    icon: Megaphone,
    title: "우선 홍보 지원",
    description: "게딱지 공식 채널 우선 소개",
  },
  {
    icon: Headset,
    title: "1:1 셋업 지원",
    description: "전담 담당자가 등록부터 운영까지",
  },
];

export function EarlyBirdSection({ handleRegisterModal }) {
  return (
    <section className="bg-gradient-to-b from-background to-primary/5 py-16 md:py-24 border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-sm font-extrabold tracking-widest text-primary mb-6 uppercase">
            Special Early Bird
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            선착순 100곳,
            <br />
            <span className="text-primary">초기 파트너</span>를 모집합니다
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            지금 입점하시면 받을 수 있는 특별 혜택
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center max-w-sm mx-auto"
          >
            <div className="flex justify-between w-full text-sm font-bold text-foreground mb-2 px-1">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                마감 임박
              </div>
              <span>42 / 100 곳 돌파!</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner flex">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "42%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
              현재 <b className="text-foreground">40곳 이상</b>이 혜택을 받고 입점했습니다.
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 text-left">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-3xl p-6 md:p-8 flex items-center gap-5 border border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-transform">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Alert Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 flex justify-center w-full"
        >
          <div className="bg-red-500/10 text-red-600 px-6 py-3 rounded-full font-bold text-sm md:text-base inline-flex items-center gap-2.5 shadow-sm border border-red-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            초기 파트너 혜택은 선착순으로 제공되며, 조기 마감될 수 있습니다
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={handleRegisterModal}
            className="rounded-full px-10 md:px-14 h-14 md:h-16 text-base md:text-lg font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all group active:scale-95"
          >
            초기 입점 혜택받기 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
