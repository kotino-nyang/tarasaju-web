"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CTA() {
    const [formData, setFormData] = useState({
        name: "",
        birthYear: "2000",
        birthMonth: "1",
        birthDay: "1",
        birthTime: "",
        contact: "",
        email: "",
        calendarType: "solar", // solar, lunar, leap
        privacyAgreement: false,
    });

    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.privacyAgreement) {
            alert("개인정보 수집 및 이용에 동의해주세요.");
            return;
        }
        const fullBirthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
        console.log("Form submitted:", { ...formData, birthDate: fullBirthDate });
        setShowPopup(true);
        // Here you would typically send data to an API
    };

    const closePopup = () => {
        setShowPopup(false);
        // Optionally reset form here
        // setFormData({...});
    };

    // Generate Year, Month, Day options
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <section id="application-form" className="relative w-full overflow-hidden bg-[#050d1a] py-20 font-light text-white antialiased md:py-28">
            {/* Background gradients */}
            <div
                className="absolute right-0 top-0 h-1/2 w-1/2 opacity-30"
                style={{
                    background:
                        "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, rgba(5, 13, 26, 0) 60%)",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-3xl font-light text-white md:text-4xl lg:text-5xl">
                        종합 사주 분석 <span className="font-bold text-[#60a5fa]">신청하기</span>
                    </h2>
                    <p className="text-white/60">
                        정확한 사주 분석을 위해 아래 정보를 입력해주세요.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mx-auto"
                >
                    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-lg md:p-10">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm text-white/70">성함</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    placeholder="홍길동"
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label htmlFor="contact" className="mb-2 block text-sm text-white/70">연락처</label>
                                <input
                                    type="tel"
                                    id="contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    placeholder="010-1234-5678"
                                />
                            </div>

                            {/* Birth Date (Split) */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-white/70">생년월일</label>
                                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                    <select
                                        name="birthYear"
                                        value={formData.birthYear}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year} className="bg-[#050d1a]">{year}년</option>
                                        ))}
                                    </select>
                                    <select
                                        name="birthMonth"
                                        value={formData.birthMonth}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    >
                                        {months.map(month => (
                                            <option key={month} value={month} className="bg-[#050d1a]">{month}월</option>
                                        ))}
                                    </select>
                                    <select
                                        name="birthDay"
                                        value={formData.birthDay}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    >
                                        {days.map(day => (
                                            <option key={day} value={day} className="bg-[#050d1a]">{day}일</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Calendar Type */}
                            <div>
                                <label className="mb-2 block text-sm text-white/70">양력 / 음력 / 윤달</label>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 min-h-[50px] items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="solar"
                                            checked={formData.calendarType === "solar"}
                                            onChange={handleChange}
                                            className="accent-[#3b82f6]"
                                        />
                                        <span className="text-white/80">양력</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="lunar"
                                            checked={formData.calendarType === "lunar"}
                                            onChange={handleChange}
                                            className="accent-[#3b82f6]"
                                        />
                                        <span className="text-white/80">음력</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="leap"
                                            checked={formData.calendarType === "leap"}
                                            onChange={handleChange}
                                            className="accent-[#3b82f6]"
                                        />
                                        <span className="text-white/80">음력 (윤달)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Birth Time */}
                            <div>
                                <label htmlFor="birthTime" className="mb-2 block text-sm text-white/70">태어난 시간</label>
                                <select
                                    id="birthTime"
                                    name="birthTime"
                                    value={formData.birthTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                >
                                    <option value="" className="bg-[#050d1a]">선택해주세요</option>
                                    <option value="unknown" className="bg-[#050d1a]">모름 (00시 기준 분석)</option>
                                    <option value="ja" className="bg-[#050d1a]">자시 (23:30 ~ 01:29)</option>
                                    <option value="chuk" className="bg-[#050d1a]">축시 (01:30 ~ 03:29)</option>
                                    <option value="in" className="bg-[#050d1a]">인시 (03:30 ~ 05:29)</option>
                                    <option value="myo" className="bg-[#050d1a]">묘시 (05:30 ~ 07:29)</option>
                                    <option value="jin" className="bg-[#050d1a]">진시 (07:30 ~ 09:29)</option>
                                    <option value="sa" className="bg-[#050d1a]">사시 (09:30 ~ 11:29)</option>
                                    <option value="o" className="bg-[#050d1a]">오시 (11:30 ~ 13:29)</option>
                                    <option value="mi" className="bg-[#050d1a]">미시 (13:30 ~ 15:29)</option>
                                    <option value="shin" className="bg-[#050d1a]">신시 (15:30 ~ 17:29)</option>
                                    <option value="yu" className="bg-[#050d1a]">유시 (17:30 ~ 19:29)</option>
                                    <option value="sul" className="bg-[#050d1a]">술시 (19:30 ~ 21:29)</option>
                                    <option value="hae" className="bg-[#050d1a]">해시 (21:30 ~ 23:29)</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="mb-2 block text-sm text-white/70">이메일</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        {/* Privacy Agreement */}
                        <div className="mt-8 flex items-start gap-3 rounded-lg border border-white/5 p-4 bg-white/5">
                            <div className="flex h-6 items-center">
                                <input
                                    id="privacyAgreement"
                                    name="privacyAgreement"
                                    type="checkbox"
                                    required
                                    checked={formData.privacyAgreement}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-[#3b82f6] focus:ring-[#3b82f6]"
                                />
                            </div>
                            <div className="text-sm">
                                <label htmlFor="privacyAgreement" className="font-medium text-white">
                                    개인정보 수집 및 이용에 동의합니다 (필수)
                                </label>
                                <p className="text-white/50 text-xs mt-1">
                                    수집된 정보(이름, 생년월일, 태어난 시간, 연락처, 이메일)는 사주 분석 서비스 제공을 위해서만 사용되며,
                                    서비스 완료 후 1개월 이내에 파기됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                type="submit"
                                className="w-full rounded-full bg-[#3b82f6] px-8 py-4 font-medium text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] transition-all duration-300 hover:bg-[#2563eb] hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)] md:w-auto"
                            >
                                종합 사주 분석 신청하기
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Submission Popup */}
            {
                showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closePopup} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl md:p-8"
                        >
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-white">사주분석 신청이 접수되었습니다.</h3>
                                <p className="text-white/60">아래 계좌로 입금해 주시면 분석이 시작됩니다.</p>
                            </div>

                            <div className="mb-8 space-y-4 rounded-xl bg-white/5 p-4">
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-white/70">상품명</span>
                                    <span className="font-medium text-white">종합사주분석 1인</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-white/70">결제 금액</span>
                                    <span className="font-bold text-[#3b82f6]">29,800원</span>
                                </div>
                                <div className="pt-1">
                                    <span className="mb-1 block text-sm text-white/70">입금 계좌</span>
                                    <div className="flex items-center justify-between rounded-lg bg-black/20 p-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">카카오뱅크 3333-05-4223067</span>
                                            <span className="text-sm text-white/60">예금주: 고수빈(노마릿)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className="flex gap-3">
                                <button
                                    onClick={closePopup}
                                    className="w-full rounded-xl bg-[#3b82f6] py-3.5 font-medium text-white transition-colors hover:bg-[#2563eb]"
                                >
                                    확인
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
        </section>
    );
}
