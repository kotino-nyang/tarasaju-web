"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {

  return (
    <section
      className="relative w-full h-screen snap-start overflow-hidden pt-16 md:pt-20 flex items-center font-light text-foreground antialiased"
      style={{
        background: "linear-gradient(90deg, #FAF7F2 0%, #F5F0E8 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 30%, rgba(44, 22, 1, 0.12) 0%, rgba(242, 238, 233, 0) 60%),
            radial-gradient(circle at 15% 30%, rgba(198, 123, 92, 0.08) 0%, rgba(242, 238, 233, 0) 60%)
          `,
        }}
      />

      {/* Hanji paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.2' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='%23D4C4A8'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:gap-8 lg:gap-16">
          {/* Left side - Text and Button */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h1 className="mb-6 text-3xl font-light md:text-5xl lg:text-6xl leading-tight md:leading-tight lg:leading-tight text-foreground">
              단 한사람을 위한
              <br />
              <span className="font-bold" style={{ color: '#2c1601' }}>정밀 사주 분석 서비스</span>
            </h1>
            <p className="mb-10 text-base text-foreground/60 md:text-lg lg:text-xl">
              수백년간 축적된 전통 사주명리의 원리를
              <br />
              현대적으로 정리한 개인 분석 리포트
            </p>

            <div className="flex justify-center md:justify-start">
              <Link
                href="#pricing"
                className="relative overflow-hidden rounded-full border border-terracotta/40 bg-terracotta/15 backdrop-blur-lg px-8 py-4 text-terracotta font-medium shadow-[0_12px_40px_rgba(198,123,92,0.25)] transition-all duration-300 hover:bg-terracotta/25 hover:shadow-[0_16px_48px_rgba(198,123,92,0.35)] hover:border-terracotta/60"
              >
                사주 분석 신청하기
              </Link>
            </div>
          </motion.div>

          {/* Right side - Taeguk */}
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 drop-shadow-[0_8px_16px_rgba(44,22,1,0.3)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                <defs>
                  <linearGradient id="yangGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C67B5C" />
                    <stop offset="100%" stopColor="#B86A4F" />
                  </linearGradient>
                  <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F2EEE9" />
                    <stop offset="100%" stopColor="#E5DED5" />
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
