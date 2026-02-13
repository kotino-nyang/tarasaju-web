"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-[#0f172a] py-20 font-light text-white antialiased md:py-28"
    >
      {/* Gradient divider */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, transparent 100%)",
        }}
      />

      {/* Background gradients */}
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-light text-white md:text-4xl lg:text-5xl">
            합리적인 <span className="font-bold text-[#60a5fa]">가격</span>으로 시작하세요
          </h2>
          <p className="mx-auto max-w-2xl text-white/60">
            한 번의 결제로 평생 간직할 수 있는 나만의 사주 분석 리포트
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#3b82f6]/30 bg-white/5 backdrop-blur-xl p-8 shadow-[0_16px_48px_rgba(59,130,246,0.3)] md:p-10">
            {/* Badges */}
            <div className="absolute right-6 top-6 flex flex-col items-center gap-2">
              <span className="rounded-full bg-[#3b82f6]/20 backdrop-blur-md border border-[#60a5fa]/30 px-3 py-1 text-xs font-medium text-[#60a5fa] text-center">
                BEST
              </span>
              <span className="rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/30 px-3 py-1 text-xs font-bold text-orange-400 text-center">
                30명 한정
              </span>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-medium text-white">
                종합 사주 분석
              </h3>
              <p className="text-sm text-white/70">
                6가지 핵심 영역 전체를 정밀 분석한 종합 리포트
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                  54% 할인
                </span>
                <span className="text-lg text-white/50 line-through">64,500원</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-white">29,800</span>
                <span className="mb-2 text-xl text-white/70">원</span>
              </div>
              <p className="mt-2 text-sm text-white/50">1회 결제 / 평생 소장</p>
            </div>

            <ul className="mb-8 space-y-3">
              {[
                "나 이해 (성격·심리)",
                "관계 (연애·배우자)",
                "커리어 (직업운)",
                "자산 (재물운)",
                "컨디션 (건강운)",
                "큰 흐름 (대운)",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#60a5fa]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-white/80">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/analysis"
              className="block w-full rounded-full border border-white/10 bg-white/10 backdrop-blur-lg py-4 text-center font-medium text-white shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] hover:border-[#3b82f6]/30"
            >
              지금 신청하기
            </Link>

            <p className="mt-4 text-center text-xs text-white/40">
              불만족시 100% 환불
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
