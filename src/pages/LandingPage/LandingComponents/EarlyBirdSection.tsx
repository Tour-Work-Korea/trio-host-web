import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Handshake, Megaphone, Headset, ArrowRight, Percent } from "lucide-react";

const benefits = [
  {
    icon: Percent,
    title: "1년 고정 수수료 3.4%",
    description: "업계 최저 수준 3.4% 수수료로\n1년 동안 마진 없이 함께 뜁니다",
  },
  {
    icon: Megaphone,
    title: "우선 홍보 지원",
    description: "SNS에서 게딱지 인증 숙소로\n가장 먼저 소개됩니다",
  },
  {
    icon: Headset,
    title: "1:1 셋업 지원",
    description: "숙소 등록부터 정산까지\n전담 담당자가 직접 설정해 드립니다",
  },
  {
    icon: Handshake,
    title: "맞춤형 기능 우선 개발",
    description: "필요한 기능을 건의하시면\n최우선으로 개발해 드립니다",
  },
];

export function EarlyBirdSection({ handleRegisterModal }) {
  return (
    <section className="bg-gradient-to-b from-background to-primary/5 py-16 md:py-24 border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl text-center">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight tracking-tight break-keep">
            초기 파트너 50곳 한정,
            <br />
            <span className="text-primary">예약 30건까지 수수료 무료</span>
          </h2>
          <p className="text-[13px] sm:text-base md:text-lg text-muted-foreground font-medium whitespace-pre-line break-keep px-4 sm:px-0">
            초기 입점 사장님들의 성공적인 시작을 위해{"\n"}게딱지를 통한 첫 30건의 예약 수수료를 전액<br className="block sm:hidden" /> 페이백 해드립니다.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center max-w-sm mx-auto"
          >
            <div className="flex justify-between w-full text-sm font-bold text-foreground mb-2 px-1">
              <div className="flex items-center gap-1.5 text-red-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                마감 임박
              </div>
              <span className="text-red-500">37 / 50 곳 입점 완료</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner flex">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "74%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-red-500 rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <p className="mt-2 text-sm text-red-500 font-bold animate-pulse">
              잔여 혜택 자리가 단 13곳 남았습니다!
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-10 text-left max-w-5xl mx-auto">
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
                  <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line break-keep">
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
          <div className="bg-red-500/10 text-red-600 px-5 sm:px-6 py-3 rounded-2xl sm:rounded-full font-bold text-[13px] sm:text-sm md:text-base inline-flex items-center gap-2.5 shadow-sm border border-red-500/20 max-w-[90%] sm:max-w-none mx-auto">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-600"></span>
            </span>
            <span className="text-center sm:text-left leading-relaxed sm:leading-normal break-keep">
              초기 파트너 혜택은 선착순으로 제공되며,<br className="block sm:hidden" /> 조기 마감될 수 있습니다
            </span>
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
