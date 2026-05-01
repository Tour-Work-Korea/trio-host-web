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
    <section className="relative bg-[#0B1120] py-20 md:py-32 border-y border-white/10 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8 max-w-6xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <span className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-blue-500/20 text-sm font-extrabold tracking-widest text-blue-400 mb-6 uppercase border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-sm">
            🚀 Special Early Bird
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight break-keep">
            초기 파트너 50곳 한정,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              예약 30건까지 수수료 무료
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium whitespace-pre-line break-keep px-4 sm:px-0">
            초기 입점 사장님들의 성공적인 시작을 위해{"\n"}게딱지를 통한 첫 30건의 예약 수수료를 전액<br className="block sm:hidden" /> 페이백 해드립니다.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center max-w-sm mx-auto bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-xl"
          >
            <div className="flex justify-between w-full text-sm font-bold text-white mb-3 px-1">
              <div className="flex items-center gap-1.5 text-red-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                마감 임박
              </div>
              <span className="text-red-400">37 / 50 곳 입점 완료</span>
            </div>
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "74%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full relative overflow-hidden shadow-[0_0_10px_rgba(244,63,94,0.6)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-red-400 font-bold animate-pulse tracking-wide">
              잔여 혜택 자리가 단 13곳 남았습니다!
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-12 text-left max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 md:p-8 flex items-center gap-5 border border-slate-700/50 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:bg-slate-800/60 hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-transform duration-300 shadow-inner border border-slate-700/50">
                  <Icon className="w-7 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 group-hover:text-blue-100 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 font-medium whitespace-pre-line break-keep group-hover:text-white transition-colors">
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
          className="mb-14 flex justify-center w-full"
        >
          <div className="bg-red-500/10 text-red-400 px-5 sm:px-6 py-3.5 rounded-2xl sm:rounded-full font-bold text-[13px] sm:text-sm md:text-base inline-flex items-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.1)] border border-red-500/30 max-w-[90%] sm:max-w-none mx-auto backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-center sm:text-left leading-relaxed sm:leading-normal break-keep tracking-wide">
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
          className="relative z-20"
        >
          <Button
            size="lg"
            onClick={handleRegisterModal}
            className="rounded-full px-10 md:px-16 h-16 md:h-20 text-lg md:text-xl font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all duration-300 group active:scale-95 border border-blue-400/30"
          >
            초기 입점 혜택받기 <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
