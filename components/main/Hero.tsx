"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#050d1a] pb-10 pt-48 font-light text-white antialiased md:pb-16 md:pt-40"
      style={{
        background: "linear-gradient(135deg, #050d1a 0%, #0f172a 100%)",
      }}
    >
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
        }}
      />
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
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

      <div className="container relative z-10 mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
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

          <div className="mb-16 sm:mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/report"
              className="relative w-full overflow-hidden rounded-full border border-white/10 bg-white/10 backdrop-blur-lg px-8 py-4 text-white font-medium shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:border-[#3b82f6]/30 sm:w-auto"
            >
              사주 분석 신청하기
            </Link>
            <a
              href="#features"
              className="flex w-full items-center justify-center gap-2 text-white/70 transition-colors hover:text-white sm:w-auto"
            >
              <span>타라사주 알아보기</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
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

          {/* Customer Reviews Carousel */}
          <motion.div
            className="relative z-10 mx-auto mt-32 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-light text-white/90 text-center mb-8">
              고객 만족도 100%
            </h3>

            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -2400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {[
                  { id: 1, content: "이직 문제로 고민이 많았는데 리포트의 직업운 분석 덕분에 용기를 얻었습니다. 정확한 시기에 맞춰 옮겼더니 연봉도 올랐네요!", author: "30대 직장인 이OO님" },
                  { id: 2, content: "인테리어만큼이나 세련된 분석 내용에 놀랐습니다. 제 성격을 정확히 꿰뚫어 보는데, 단순한 운세를 넘어 심리학 서적을 읽는 기분이었어요.", author: "20대 프리랜서 김OO님" },
                  { id: 3, content: "연애운 리포트를 보고 제 연애 스타일의 문제점을 발견했습니다. 덕분에 지금은 저와 꼭 맞는 좋은 분을 만나 행복합니다.", author: "30대 전문직 박OO님" },
                  { id: 4, content: "건강운에서 주의하라는 부분을 검진했더니 조기에 발견해 치료할 수 있었습니다. 타라사주가 제 생명의 은인이나 다름없어요.", author: "40대 주부 최OO님" },
                  { id: 5, content: "사업 확장 시기를 고민하던 중 대운 흐름을 확인하고 결정했습니다. 확실히 운의 흐름을 알고 나아가니 성과가 다릅니다.", author: "40대 대표 정OO님" },
                  { id: 6, content: "막막했던 취업 준비 기간에 제 사주 리포트가 큰 위로와 확신이 되었습니다. 할 수 있다는 자신감을 얻어 결국 합격했습니다.", author: "20대 취준생 강OO님" },
                  { id: 7, content: "재물운 리포트는 제 재테크의 바이블입니다. 언제 투자하고 언제 조심해야 하는지 명확히 알려주니 마음이 든든하네요.", author: "30대 투자자 윤OO님" },
                  { id: 8, content: "부부 사이가 소원했는데 서로의 기질 리포트를 보고 이해의 폭이 넓어졌습니다. 덕분에 집안 분위기가 다시 화목해졌습니다.", author: "40대 직장인 한OO님" },
                  { id: 9, content: "친구에게 선물로 줬는데 너무 좋아하더라고요. 디자인도 예쁘고 내용도 풍성해서 가치 있는 선물을 한 것 같아 뿌듯합니다.", author: "20대 대학생 신OO님" },
                  { id: 10, content: "복잡한 고민이 있을 때마다 타라사주를 찾게 됩니다. 항상 긍정적이고 확신 있는 조언을 해주셔서 삶의 에너지를 얻습니다.", author: "30대 디자이너 송OO님" },
                  { id: 11, content: "이직 문제로 고민이 많았는데 리포트의 직업운 분석 덕분에 용기를 얻었습니다. 정확한 시기에 맞춰 옮겼더니 연봉도 올랐네요!", author: "30대 직장인 이OO님" },
                  { id: 12, content: "인테리어만큼이나 세련된 분석 내용에 놀랐습니다. 제 성격을 정확히 꿰뚫어 보는데, 단순한 운세를 넘어 심리학 서적을 읽는 기분이었어요.", author: "20대 프리랜서 김OO님" },
                ].map((review) => (
                  <div
                    key={review.id}
                    className="flex-shrink-0 w-[400px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(59,130,246,0.2)]"
                  >
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      "{review.content}"
                    </p>
                    <p className="text-[#60a5fa] text-xs font-medium">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
