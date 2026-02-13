"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AnalysisPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("detail");
    const [baseQuantity] = useState(1); // 기본 1인은 항상 1개
    const [additionalQuantity, setAdditionalQuantity] = useState(0); // 추가 인원
    const { addItem } = useCart();
    const { user } = useAuth();

    const basePrice = 29800;
    const additionalPrice = 24500;
    const totalPrice = basePrice + (additionalPrice * additionalQuantity);
    const totalPeople = baseQuantity + additionalQuantity;

    const handleAddToCart = () => {
        // 로그인 체크
        if (!user) {
            alert("로그인이 필요합니다.");
            router.push("/auth");
            return;
        }

        // 기본 1인 추가
        addItem({
            id: Date.now().toString() + "-base",
            title: "[불만족시 100%환불] 종합사주분석",
            option: "종합사주분석 1인",
            price: basePrice,
            image: "/detail image/thumnail.png",
            personIndex: 0
        });

        // 추가 인원 추가
        for (let i = 0; i < additionalQuantity; i++) {
            addItem({
                id: Date.now().toString() + "-add-" + i,
                title: "[불만족시 100%환불] 종합사주분석",
                option: "종합사주분석 1인 추가",
                price: additionalPrice,
                image: "/detail image/thumnail.png",
                personIndex: i + 1
            });
        }

        alert(`${totalPeople}명의 사주분석이 장바구니에 담겼습니다.`);
    };

    const handlePurchase = () => {
        // 로그인 체크
        if (!user) {
            alert("로그인이 필요합니다.");
            router.push("/auth");
            return;
        }

        // 구매 페이지로 이동 (인원수 정보 전달)
        router.push(`/checkout?baseQuantity=${baseQuantity}&additionalQuantity=${additionalQuantity}&totalPrice=${totalPrice}`);
    };

    return (
        <>
            <Header />
            <main
                className="relative min-h-screen overflow-hidden bg-[#050d1a] pt-32 pb-20 text-white bg-gradient-to-b from-[#050d1a] to-[#0f172a]"
            >
                {/* Background Decorations from Hero */}
                <div
                    className="absolute right-0 top-0 h-full w-1/2 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.15)_0%,rgba(5,13,26,0)_70%)]"
                />
                <div
                    className="absolute left-0 top-0 h-full w-1/2 -scale-x-100 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.15)_0%,rgba(5,13,26,0)_70%)]"
                />

                {/* Floating stars decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute left-[calc(var(--random-left)*100%)] top-[calc(var(--random-top)*100%)]"
                            style={{
                                '--random-left': Math.random(),
                                '--random-top': Math.random(),
                            } as React.CSSProperties}
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

                <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">

                    {/* Top Section: Product Info */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
                        {/* Left: Thumbnail */}
                        <div className="w-full lg:w-1/3">
                            <div className="aspect-square w-full relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                <img
                                    src="/detail image/thumnail.png"
                                    alt="[불만족시 100%환불] 종합사주분석"
                                    className="object-cover w-full h-full select-none"
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable={false}
                                />
                            </div>
                        </div>

                        {/* Right: Product Details & Actions */}
                        <div className="w-full lg:w-2/3 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="inline-block rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1 text-xs font-medium text-[#60a5fa]">
                                    BEST
                                </span>
                                <span className="ml-2 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                                    30명 한정 특가
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">[불만족시 100%환불] 종합사주분석</h1>
                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-lg text-white/50 line-through">64,500원</span>
                                <p className="text-3xl font-bold text-[#3b82f6]">29,800원</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-4 mb-6">
                                {/* 기본 1인 */}
                                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">종합사주분석 1인</p>
                                            <p className="text-xs text-white/50 mt-1">29,800원</p>
                                        </div>
                                        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                                            <span className="text-white">1</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 추가 인원 */}
                                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">종합사주분석 1인 추가</p>
                                            <p className="text-xs text-white/50 mt-1">+24,500원 / 1인</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setAdditionalQuantity(Math.max(0, additionalQuantity - 1))}
                                                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                                                disabled={additionalQuantity === 0}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-white font-medium">{additionalQuantity}</span>
                                            <button
                                                onClick={() => setAdditionalQuantity(additionalQuantity + 1)}
                                                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 총 금액 표시 */}
                                <div className="rounded-lg border border-[#3b82f6]/30 bg-[#3b82f6]/10 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">총 {totalPeople}명</p>
                                            <p className="text-xs text-white/50 mt-1">분석 대상 인원</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#3b82f6]">{totalPrice.toLocaleString()}원</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-sm text-white/50 mb-6">*본 상품은 디지털 상품으로 배송이 없습니다.</p>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-4 font-medium text-white transition-colors hover:bg-white/10"
                                >
                                    장바구니
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    className="flex-1 rounded-lg bg-[#3b82f6] px-6 py-4 font-medium text-white transition-colors hover:bg-[#2563eb] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Tabs & Content */}
                    <div className="w-full">
                        {/* Tabs Navigation */}
                        <div className="sticky top-20 z-10 flex border-b border-white/10 bg-[#050d1a]/95 backdrop-blur-sm mb-8">
                            {["detail", "reviews", "qna"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-4 text-sm md:text-base font-medium transition-colors ${activeTab === tab
                                        ? "border-b-2 border-[#3b82f6] text-[#3b82f6]"
                                        : "text-white/50 hover:text-white"
                                        }`}
                                >
                                    {tab === "detail" && "상세정보"}
                                    {tab === "reviews" && "구매평"}
                                    {tab === "qna" && "Q&A"}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {activeTab === "detail" && (
                                <div className="flex flex-col items-center max-w-4xl mx-auto animate-in fade-in duration-300">
                                    <img
                                        src="/detail image/1.png"
                                        alt="Detail 1"
                                        className="w-full h-auto object-contain mb-0 select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <img
                                        src="/detail image/2.gif"
                                        alt="Detail 2"
                                        className="w-full h-auto object-contain mb-0 select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <img
                                        src="/detail image/3.png"
                                        alt="Detail 3"
                                        className="w-full h-auto object-contain mb-0 select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <img
                                        src="/detail image/4.gif"
                                        alt="Detail 4"
                                        className="w-full h-auto object-contain mb-0 select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <img
                                        src="/detail image/5.png"
                                        alt="Detail 5"
                                        className="w-full h-auto object-contain mb-0 select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="py-12 text-center text-white/50 animate-in fade-in duration-300">
                                    <p className="mb-2 text-lg">등록된 구매평이 없습니다.</p>
                                    <p className="mb-6 text-sm">첫 번째 구매평을 남겨주세요!</p>
                                    <button className="rounded-lg border border-white/20 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/40">
                                        구매평 작성
                                    </button>
                                </div>
                            )}

                            {activeTab === "qna" && (
                                <div className="py-12 text-center text-white/50 animate-in fade-in duration-300">
                                    <p className="mb-2 text-lg">등록된 Q&A가 없습니다.</p>
                                    <p className="mb-6 text-sm">궁금한 점이 있다면 문의해주세요.</p>
                                    <button className="rounded-lg border border-white/20 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/40">
                                        상품문의
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
}
