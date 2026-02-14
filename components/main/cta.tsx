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
        <section id="application-form" className="relative w-full overflow-hidden bg-background py-20 font-light text-foreground antialiased md:py-28">
            {/* Background gradients */}
            <div
                className="absolute right-0 top-0 h-1/2 w-1/2 opacity-30 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 70% 30%, rgba(198, 123, 92, 0.1) 0%, rgba(242, 238, 233, 0) 60%)",
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
                    <h2 className="mb-4 text-3xl font-light text-foreground md:text-4xl lg:text-5xl">
                        종합 사주 분석 <span className="font-bold text-terracotta">신청하기</span>
                    </h2>
                    <p className="text-foreground/60">
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
                    <form onSubmit={handleSubmit} className="rounded-2xl border border-woody-brown/10 bg-white p-8 shadow-xl md:p-10">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm text-foreground/70 font-medium">성함</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground placeholder-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                    placeholder="홍길동"
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label htmlFor="contact" className="mb-2 block text-sm text-foreground/70 font-medium">연락처</label>
                                <input
                                    type="tel"
                                    id="contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground placeholder-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all font-mono"
                                    placeholder="010-1234-5678"
                                />
                            </div>

                            {/* Birth Date (Split) */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-foreground/70 font-medium">생년월일</label>
                                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                    <select
                                        name="birthYear"
                                        value={formData.birthYear}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}년</option>
                                        ))}
                                    </select>
                                    <select
                                        name="birthMonth"
                                        value={formData.birthMonth}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                    >
                                        {months.map(month => (
                                            <option key={month} value={month}>{month}월</option>
                                        ))}
                                    </select>
                                    <select
                                        name="birthDay"
                                        value={formData.birthDay}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                    >
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}일</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Calendar Type */}
                            <div>
                                <label className="mb-2 block text-sm text-foreground/70 font-medium">양력 / 음력 / 윤달</label>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 min-h-[50px] items-center">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="solar"
                                            checked={formData.calendarType === "solar"}
                                            onChange={handleChange}
                                            className="radio-terracotta accent-terracotta"
                                        />
                                        <span className="text-foreground/80 group-hover:text-terracotta transition-colors">양력</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="lunar"
                                            checked={formData.calendarType === "lunar"}
                                            onChange={handleChange}
                                            className="radio-terracotta accent-terracotta"
                                        />
                                        <span className="text-foreground/80 group-hover:text-terracotta transition-colors">음력</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="calendarType"
                                            value="leap"
                                            checked={formData.calendarType === "leap"}
                                            onChange={handleChange}
                                            className="radio-terracotta accent-terracotta"
                                        />
                                        <span className="text-foreground/80 group-hover:text-terracotta transition-colors">음력 (윤달)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Birth Time */}
                            <div>
                                <label htmlFor="birthTime" className="mb-2 block text-sm text-foreground/70 font-medium">태어난 시간</label>
                                <select
                                    id="birthTime"
                                    name="birthTime"
                                    value={formData.birthTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="unknown">모름 (00시 기준 분석)</option>
                                    <option value="ja" className="bg-white">자시 (23:00-01:00)</option>
                                    <option value="chuk" className="bg-white">축시 (01:00-03:00)</option>
                                    <option value="in" className="bg-white">인시 (03:00-05:00)</option>
                                    <option value="myo" className="bg-white">묘시 (05:00-07:00)</option>
                                    <option value="jin" className="bg-white">진시 (07:00-09:00)</option>
                                    <option value="sa" className="bg-white">사시 (09:00-11:00)</option>
                                    <option value="o" className="bg-white">오시 (11:00-13:00)</option>
                                    <option value="mi" className="bg-white">미시 (13:00-15:00)</option>
                                    <option value="sin" className="bg-white">신시 (15:00-17:00)</option>
                                    <option value="yu" className="bg-white">유시 (17:00-19:00)</option>
                                    <option value="sul" className="bg-white">술시 (19:00-21:00)</option>
                                    <option value="hae" className="bg-white">해시 (21:00-23:00)</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="mb-2 block text-sm text-foreground/70 font-medium">이메일</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-woody-brown/10 bg-sub-background px-4 py-3 text-foreground placeholder-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        {/* Privacy Agreement */}
                        <div className="mt-8 flex items-start gap-3 rounded-lg border border-woody-brown/10 p-4 bg-background">
                            <div className="flex h-6 items-center">
                                <input
                                    id="privacyAgreement"
                                    name="privacyAgreement"
                                    type="checkbox"
                                    required
                                    checked={formData.privacyAgreement}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-woody-brown/20 text-terracotta focus:ring-terracotta/50"
                                />
                            </div>
                            <div className="text-sm">
                                <label htmlFor="privacyAgreement" className="font-medium text-foreground">
                                    개인정보 수집 및 이용에 동의합니다 (필수)
                                </label>
                                <p className="text-foreground/50 text-xs mt-1 leading-relaxed">
                                    수집된 정보(이름, 생년월일, 태어난 시간, 연락처, 이메일)는 사주 분석 서비스 제공을 위해서만 사용되며,
                                    서비스 완료 후 1개월 이내에 파기됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                type="submit"
                                className="w-full rounded-full bg-terracotta px-12 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:bg-terracotta/90 hover:scale-105 md:w-auto"
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
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePopup} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-woody-brown/10 bg-white p-6 shadow-2xl md:p-8"
                        >
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage/10 text-sage border border-sage/20">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-foreground">사주분석 신청 완료</h3>
                                <p className="text-foreground/50 text-sm">아래 계좌로 입금해 주시면 분석이 시작됩니다.</p>
                            </div>

                            <div className="mb-8 space-y-4 rounded-2xl bg-sub-background p-6 border border-woody-brown/5">
                                <div className="flex justify-between border-b border-woody-brown/10 pb-4">
                                    <span className="text-foreground/60 text-sm">상품명</span>
                                    <span className="font-medium text-foreground">종합사주분석 1인</span>
                                </div>
                                <div className="flex justify-between border-b border-woody-brown/10 pb-4">
                                    <span className="text-foreground/60 text-sm">결제 금액</span>
                                    <span className="font-bold text-terracotta text-lg">29,800원</span>
                                </div>
                                <div className="pt-2">
                                    <span className="mb-2 block text-xs font-semibold text-terracotta uppercase tracking-wider">입금 계좌</span>
                                    <div className="flex flex-col gap-1 rounded-xl bg-white p-4 border border-woody-brown/10">
                                        <span className="font-bold text-foreground text-base font-mono">카카오뱅크 3333-05-4223067</span>
                                        <span className="text-sm text-foreground/60">예금주: 고수빈(노마릿)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closePopup}
                                    className="w-full rounded-full bg-terracotta py-4 font-medium text-white transition-all hover:bg-terracotta/90 shadow-lg"
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
