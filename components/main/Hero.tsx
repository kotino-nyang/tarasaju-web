"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#050d1a] pb-20 pt-48 font-light text-white antialiased md:pb-28 md:pt-40"
      style={{
        background: "linear-gradient(180deg, #050d1a 0%, #0f172a 100%)",
      }}
    >
      <div
        className="absolute right-0 top-0 h-full w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(5, 13, 26, 0) 70%)",
        }}
      />
      <div
        className="absolute left-0 top-0 h-full w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15) 0%, rgba(5, 13, 26, 0) 70%)",
        }}
      />

      {/* Floating stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <svg width="4" height="4" viewBox="0 0 4 4">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full px-4 text-center md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <span className="mb-6 inline-block rounded-full border border-[#3b82f6]/30 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-[#60a5fa] font-medium shadow-sm">
            정밀 사주 분석
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl leading-tight md:leading-tight lg:leading-tight">
            단 한사람을 위한
            <br />
            <span className="text-[#60a5fa] font-bold">정밀 사주 분석 리포트</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            수백년간 축적된 전통 사주명리의 원리를
            <br className="hidden md:block" />
            현대적으로 정리한 개인 분석 리포트
          </p>

          <div className="mb-16 sm:mb-20 flex justify-center">
            <Link
              href="#pricing"
              className="relative w-full overflow-hidden rounded-full border border-white/10 bg-white/10 backdrop-blur-lg px-8 py-4 text-white font-medium shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:border-[#3b82f6]/30 sm:w-auto"
            >
              사주 분석 신청하기
            </Link>
          </div>
        </motion.div>

        {/* Taeguk and decorative elements */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Central Taeguk Symbol */}
          <div className="relative mx-auto w-full max-w-3xl">
            <motion.div
              className="relative mx-auto w-48 h-48 md:w-64 md:h-64"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                <defs>
                  <linearGradient id="yangGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="100" fill="url(#yinGrad)" />
                <path
                  d="M 100 0 A 50 50 0 0 1 100 100 A 50 50 0 0 0 100 200 A 100 100 0 0 1 100 0"
                  fill="url(#yangGrad)"
                />
                <circle cx="100" cy="50" r="15" fill="url(#yinGrad)" />
                <circle cx="100" cy="150" r="15" fill="url(#yangGrad)" />
              </svg>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
