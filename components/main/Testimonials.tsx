"use client";

import { motion } from "framer-motion";

const reviews = [
  { id: 1, content: "이직 문제로 고민이 많았는데 리포트의 직업운 분석 덕분에 용기를 얻었습니다. 정확한 시기에 맞춰 옮겼더니 연봉도 올랐네요!", author: "30대 직장인 이OO님" },
  { id: 2, content: "인테리어만큼이나 세련된 분석 내용에 놀랐습니다. 제 성격을 정확히 꿰뚫어 보는데, 단순한 운세를 넘어 심리학 서적을 읽는 기분이었어요.", author: "20대 프리랜서 김OO님" },
  { id: 3, content: "연애운 리포트를 보고 제 연애 스타일의 문제점을 발견했습니다. 덕분에 지금은 저와 꼭 맞는 좋은 분을 만나 행복합니다.", author: "30대 전문직 박OO님" },
  { id: 4, content: "건강운 분석을 보고 평소 무심했던 건강 관리에 신경 쓰게 되었습니다. 덕분에 정기 검진도 제때 받게 되었네요.", author: "40대 주부 최OO님" },
  { id: 5, content: "사업 확장 시기를 고민하던 중 대운 흐름을 확인하고 결정했습니다. 확실히 운의 흐름을 알고 나아가니 성과가 다릅니다.", author: "40대 대표 정OO님" },
  { id: 6, content: "막막했던 취업 준비 기간에 제 사주 리포트가 큰 위로와 확신이 되었습니다. 할 수 있다는 자신감을 얻어 결국 합격했습니다.", author: "20대 취준생 강OO님" },
  { id: 7, content: "재물운 리포트는 제 재테크의 바이블입니다. 언제 투자하고 언제 조심해야 하는지 명확히 알려주니 마음이 든든하네요.", author: "30대 투자자 윤OO님" },
  { id: 8, content: "부부 사이가 소원했는데 서로의 기질 리포트를 보고 이해의 폭이 넓어졌습니다. 덕분에 집안 분위기가 다시 화목해졌습니다.", author: "40대 직장인 한OO님" },
  { id: 9, content: "친구에게 선물로 줬는데 너무 좋아하더라고요. 디자인도 예쁘고 내용도 풍성해서 가치 있는 선물을 한 것 같아 뿌듯합니다.", author: "20대 대학생 신OO님" },
  { id: 10, content: "복잡한 고민이 있을 때마다 타라사주를 찾게 됩니다. 항상 긍정적이고 확신 있는 조언을 해주셔서 삶의 에너지를 얻습니다.", author: "30대 디자이너 송OO님" },
];

// Duplicate for seamless loop
const duplicatedReviews = [...reviews, ...reviews];

export default function Testimonials() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0f172a] py-20 md:py-28 font-light text-white antialiased">
      {/* Gradient divider */}
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.3) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-light md:text-4xl lg:text-5xl">
            고객 만족도 <span className="font-bold text-[#60a5fa]">100%</span>
          </h2>
          <p className="text-white/60">실제 고객님들의 생생한 후기입니다</p>
        </motion.div>

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
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-[400px] min-h-[200px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(59,130,246,0.2)] flex flex-col justify-between"
              >
                <p className="text-white/80 text-base leading-relaxed mb-4">
                  "{review.content}"
                </p>
                <p className="text-[#60a5fa] text-sm font-medium">
                  - {review.author}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
