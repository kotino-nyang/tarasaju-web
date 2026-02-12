"use client";

import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    title: "나 이해(성격・심리)",
    description: "흔들리는 이유를 구조로 정리해 결정 피로를 줄입니다.",
    icon: "🧘"
  },
  {
    id: 2,
    title: "관계(연애・배우자)",
    description: "맞는 사람의 결·타이밍을 확인해 같은 실수를 반복하지 않게 합니다.",
    icon: "💑"
  },
  {
    id: 3,
    title: "커리어(직업운)",
    description: "버틸지 옮길지, 성과 나는 순서를 먼저 정리합니다.",
    icon: "💼"
  },
  {
    id: 4,
    title: "자산(재물운)",
    description: "돈이 붙는/새는 구간을 구분해 흐름을 안정화합니다.",
    icon: "💰"
  },
  {
    id: 5,
    title: "컨디션(건강운)",
    description: "무너지는 포인트를 미리 알고 관리 루틴을 잡습니다.",
    icon: "🌱"
  },
  {
    id: 6,
    title: "큰 흐름(대운(大運))",
    description: "변곡점을 읽어 기회는 선점, 위기는 회피하게 돕습니다.",
    icon: "⏳"
  }
];

export default function Features() {
  return (
    <section
      id="features"
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
        className="absolute right-0 top-0 h-1/2 w-1/2 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
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
            정밀 사주 분석으로 <span className="font-bold text-[#60a5fa]">인생의 지도</span>를 받으세요
          </h2>
          <p className="mx-auto max-w-2xl text-white/60">
            6가지 핵심 영역에 대한 체계적인 분석을 통해 당신의 삶을 명확하게 정리합니다
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all hover:border-[#3b82f6]/30 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)]"
            >
              <div className="mb-4 text-5xl">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-medium text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
