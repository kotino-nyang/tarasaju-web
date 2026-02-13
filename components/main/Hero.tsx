"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Fixed star positions to avoid hydration mismatch
const STAR_POSITIONS = [
  { left: 8.41, top: 1.73, duration: 4.2, delay: 0.5 },
  { left: 65.55, top: 16.62, duration: 3.8, delay: 1.2 },
  { left: 24.34, top: 84.98, duration: 4.5, delay: 0.8 },
  { left: 18.02, top: 29.46, duration: 3.5, delay: 1.5 },
  { left: 90.14, top: 8.95, duration: 4.0, delay: 0.3 },
  { left: 58.92, top: 81.63, duration: 3.3, delay: 1.8 },
  { left: 38.51, top: 96.32, duration: 4.8, delay: 0.2 },
  { left: 66.25, top: 63.16, duration: 3.7, delay: 1.0 },
  { left: 55.18, top: 90.45, duration: 4.3, delay: 1.4 },
  { left: 9.97, top: 74.55, duration: 3.9, delay: 0.6 },
  { left: 26.09, top: 40.92, duration: 4.1, delay: 1.6 },
  { left: 10.64, top: 80.16, duration: 3.6, delay: 0.9 },
  { left: 53.13, top: 3.56, duration: 4.4, delay: 1.3 },
  { left: 88.95, top: 52.48, duration: 3.4, delay: 0.7 },
  { left: 86.62, top: 99.32, duration: 4.6, delay: 1.1 },
  { left: 28.29, top: 99.73, duration: 3.8, delay: 1.7 },
  { left: 3.69, top: 24.28, duration: 4.2, delay: 0.4 },
  { left: 21.50, top: 59.49, duration: 3.5, delay: 1.9 },
  { left: 5.76, top: 41.98, duration: 4.7, delay: 0.1 },
  { left: 35.75, top: 50.56, duration: 3.9, delay: 1.2 },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#050d1a] pb-20 pt-48 font-light text-white antialiased md:pb-28 md:pt-40"
      style={{
        background: "linear-gradient(180deg, #050d1a 0%, #0f172a 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.1) 0%, rgba(5, 13, 26, 0) 80%)",
        }}
      />

      {/* Floating stars decoration */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STAR_POSITIONS.map((star, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            >
              <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="1" fill="#3b82f6" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto w-full px-4 text-center md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <span className="mb-6 inline-block rounded-full border border-[#3b82f6]/30 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-[#60a5fa] font-medium shadow-sm">
            정밀 사주 분석
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-3xl font-light md:text-5xl lg:text-7xl leading-tight md:leading-tight lg:leading-tight px-2">
            단 한사람을 위한
            <br />
            <span className="text-[#60a5fa] font-bold">정밀 사주 분석 리포트</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-white/60 md:text-xl px-4">
            수백년간 축적된 전통 사주명리의 원리를
            <br className="hidden md:block" />
            현대적으로 정리한 개인 분석 리포트
          </p>

          <div className="mb-16 sm:mb-20 flex justify-center px-6">
            <Link
              href="#pricing"
              className="relative w-full overflow-hidden rounded-full border border-white/10 bg-white/10 backdrop-blur-lg px-8 py-4 text-white font-medium shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:border-[#3b82f6]/30 sm:w-auto text-center"
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
              className="relative mx-auto w-32 h-32 md:w-64 md:h-64"
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
