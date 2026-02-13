"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "@/components/reviews/ReviewForm";
import QnAForm from "@/components/qna/QnAForm";
import { createClient } from "@/lib/supabase/client";
import { verifyPassword } from "@/lib/utils/passwordHash";

export default function AnalysisPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("detail");
    const [baseQuantity] = useState(1); // 기본 1인은 항상 1개
    const [additionalQuantity, setAdditionalQuantity] = useState(0); // 추가 인원
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showQnAModal, setShowQnAModal] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [qnaList, setQnaList] = useState<any[]>([]);
    const [unlockedQnAIds, setUnlockedQnAIds] = useState<Set<string>>(new Set());
    const [passwordModal, setPasswordModal] = useState<{ show: boolean; qna: any | null }>({ show: false, qna: null });
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { addItem } = useCart();
    const { user } = useAuth();

    const basePrice = 29800;
    const additionalPrice = 24500;
    const totalPrice = basePrice + (additionalPrice * additionalQuantity);
    const totalPeople = baseQuantity + additionalQuantity;

    useEffect(() => {
        loadReviews();
        loadQnA();
    }, []);

    const loadReviews = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                *,
                orders (
                    customer_name
                )
            `)
            .eq("is_approved", true)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setReviews(data);
        }
    };

    const loadQnA = async () => {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Load ALL Q&A (both public and private)
        // Private Q&A will be shown with lock icon
        const { data: allQnA, error } = await supabase
            .from("qna")
            .select("*")
            .eq("is_deleted", false)
            .order("created_at", { ascending: false });

        if (!error && allQnA) {
            // If user is logged in, automatically unlock their own Q&A
            if (user) {
                const userQnAIds = allQnA
                    .filter(qna => qna.user_id === user.id)
                    .map(qna => qna.id);
                setUnlockedQnAIds(new Set(userQnAIds));
            }
            setQnaList(allQnA);
        }
    };

    const handleQnAClick = (qna: any) => {
        // If public or already unlocked, no password needed
        if (qna.is_public || unlockedQnAIds.has(qna.id)) {
            return;
        }
        // Show password modal for private Q&A
        setPasswordModal({ show: true, qna });
        setPasswordInput("");
        setPasswordError("");
    };

    const handlePasswordSubmit = async () => {
        if (!passwordModal.qna) return;

        const isValid = await verifyPassword(passwordInput, passwordModal.qna.password_hash);

        if (isValid) {
            // Add to unlocked list
            setUnlockedQnAIds(prev => new Set([...prev, passwordModal.qna.id]));
            setPasswordModal({ show: false, qna: null });
            setPasswordInput("");
            setPasswordError("");
        } else {
            setPasswordError("비밀번호가 일치하지 않습니다.");
        }
    };

    const handleAddToCart = () => {
        // 로그인 체크
        if (!user) {
            alert("로그인이 필요합니다.");
            const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/auth?next=${currentPath}`);
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
            const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/auth?next=${currentPath}`);
            return;
        }

        // 구매 페이지로 이동 (인원수 정보 전달)
        router.push(`/checkout?baseQuantity=${baseQuantity}&additionalQuantity=${additionalQuantity}&totalPrice=${totalPrice}`);
    };

    return (
        <div className="min-h-screen bg-[#050d1a] text-white selection:bg-blue-500/30">
            <Header />

            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradients */}
                <div
                    className="absolute inset-x-0 top-0 h-[500px] opacity-40 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)"
                    }}
                />

                <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="mb-4 text-3xl font-light md:text-5xl">
                            종합 <span className="font-bold text-[#60a5fa]">사주 분석</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-white/60">
                            당신의 삶을 꿰뚫어보는 정밀한 분석 리포트로 <br className="hidden md:block" />
                            명확한 인생의 지도를 그려드립니다.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Content Area */}
                        <div className="lg:col-span-8">
                            {/* Tabs */}
                            <div className="mb-6 flex gap-2 border-b border-white/10 pb-px">
                                {[
                                    { id: 'detail', label: '상세정보' },
                                    { id: 'reviews', label: '구매평' },
                                    { id: 'qna', label: 'Q&A' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
                                {activeTab === "detail" && (
                                    <div className="space-y-12">
                                        <section>
                                            <h2 className="mb-6 flex items-center gap-3 text-2xl font-medium">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">01</span>
                                                어떤 내용을 분석하나요?
                                            </h2>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {[
                                                    { title: "나 이해(성격·심리)", desc: "강점과 보완점, 심리 기저 분석" },
                                                    { title: "관계(연애·배우자)", desc: "인연의 결, 관계 지속력 분석" },
                                                    { title: "커리어(직업운)", desc: "적성, 이직 시기, 성공 전략" },
                                                    { title: "자산(재물운)", desc: "재물 흐름, 투자 성향, 리스크" },
                                                    { title: "컨디션(건강운)", desc: "신체 에너지, 주의할 건강 포인트" },
                                                    { title: "큰 흐름(대운)", desc: "인생의 변곡점과 기회 포착" }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="rounded-2xl border border-white/5 bg-white/5 p-5 transition-colors hover:bg-white/10">
                                                        <h3 className="mb-1 font-medium text-white">{item.title}</h3>
                                                        <p className="text-sm text-white/50">{item.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="mb-6 flex items-center gap-3 text-2xl font-medium">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">02</span>
                                                이렇게 진행됩니다
                                            </h2>
                                            <div className="relative space-y-8 pl-8 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-white/10">
                                                {[
                                                    { step: "신청 완료", desc: "이름, 생년월일, 태어난 시간 입력 후 결제" },
                                                    { step: "상세 분석", desc: "타라사주의 정밀 알고리즘으로 데이터 분석 및 정리" },
                                                    { step: "리포트 발송", desc: "PDF 리포트 생성 및 마이페이지 업로드 (24시간 이내)" },
                                                    { step: "추가 질의", desc: "리포트 내용에 대한 1회 추가 궁금증 해결" }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-[#050d1a]" />
                                                        <h3 className="mb-1 font-medium">{item.step}</h3>
                                                        <p className="text-sm text-white/50">{item.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-medium">구매평 ({reviews.length})</h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-medium">4.9/5.0</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowReviewModal(true)}
                                                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                            >
                                                구매평 작성
                                            </button>
                                        </div>

                                        <div className="grid gap-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-colors hover:bg-white/10">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400">
                                                                {review.orders?.customer_name?.[0] || '익'}
                                                            </div>
                                                            <div>
                                                                <span className="block text-sm font-medium">{review.orders?.customer_name || '익명'}</span>
                                                                <div className="flex text-yellow-500">
                                                                    {[...Array(review.rating)].map((_, i) => (
                                                                        <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-white/30">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-white/70">{review.content}</p>
                                                    {review.image_url && (
                                                        <img src={review.image_url} alt="Review" className="mt-4 max-h-40 rounded-lg border border-white/10" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "qna" && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-medium">Q&A ({qnaList.length})</h3>
                                            <button
                                                onClick={() => setShowQnAModal(true)}
                                                className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20 hover:border-white/30 border border-white/10"
                                            >
                                                문의하기
                                            </button>
                                        </div>

                                        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                                            {qnaList.map((qna) => (
                                                <button
                                                    key={qna.id}
                                                    onClick={() => handleQnAClick(qna)}
                                                    className="flex items-center justify-between bg-[#0f172a] p-5 text-left transition-colors hover:bg-white/5"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {qna.is_public ? (
                                                            <svg className="h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        )}
                                                        <span className={`text-sm ${qna.is_public || unlockedQnAIds.has(qna.id) ? 'text-white' : 'text-white/30'}`}>
                                                            {qna.is_public || unlockedQnAIds.has(qna.id) ? qna.question.substring(0, 30) + "..." : "비밀글입니다."}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {qna.is_answered ? (
                                                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">답변완료</span>
                                                        ) : (
                                                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/30">대기중</span>
                                                        )}
                                                        <span className="text-xs text-white/30">{new Date(qna.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Sticky Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="rounded-3xl border-2 border-blue-500/30 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">주문하기</h2>
                                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">BEST</span>
                                </div>

                                <div className="mb-8 space-y-4">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span>기본 사주 분석 (1인)</span>
                                        <span>{basePrice.toLocaleString()}원</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">추가 분석 인원</span>
                                            <span className="text-xs text-white/40">함께 보는 궁합/관계 가능</span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
                                            <button
                                                onClick={() => setAdditionalQuantity(Math.max(0, additionalQuantity - 1))}
                                                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-medium">{additionalQuantity}</span>
                                            <button
                                                onClick={() => setAdditionalQuantity(additionalQuantity + 1)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {additionalQuantity > 0 && (
                                        <div className="flex items-center justify-between text-sm text-blue-400/80">
                                            <span>추가 인원 할인 적용</span>
                                            <span>+{(additionalPrice * additionalQuantity).toLocaleString()}원</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8 border-t border-white/10 pt-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-white/60">최종 결제 금액</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-bold text-white">{totalPrice.toLocaleString()}</span>
                                            <span className="ml-1 text-lg text-white/70">원</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-[10px] text-white/30 italic">
                                        * 분석 리포트는 신청 후 24시간 이내에 발송됩니다.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            const item = {
                                                id: "analysis_all",
                                                title: "종합 사주 분석",
                                                price: totalPrice,
                                                image: "https://i.imgur.com/sdU9nRt.png",
                                                option: `${totalPeople}인 분석`,
                                                baseQuantity,
                                                additionalQuantity,
                                            };
                                            addItem(item);
                                            alert("장바구니에 담겼습니다.");
                                        }}
                                        className="w-full rounded-2xl border border-white/20 bg-white/5 py-4 font-medium transition-all hover:bg-white/10"
                                    >
                                        장바구니 담기
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                alert("로그인이 필요합니다.");
                                                const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
                                                router.push(`/auth?next=${currentPath}`);
                                                return;
                                            }
                                            router.push(`/checkout?totalPrice=${totalPrice}&baseQuantity=${baseQuantity}&additionalQuantity=${additionalQuantity}`);
                                        }}
                                        className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 font-bold transition-all hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.98]"
                                    >
                                        <span className="relative z-10">지금 바로 신청하기</span>
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <AnimatePresence>
                {showReviewModal && (
                    <ReviewForm
                        productName="종합 사주 분석"
                        onClose={() => {
                            setShowReviewModal(false);
                            loadReviews();
                        }}
                    />
                )}
                {showQnAModal && (
                    <QnAForm
                        productName="종합 사주 분석"
                        onClose={() => {
                            setShowQnAModal(false);
                            loadQnA();
                        }}
                    />
                )}
                {passwordModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                        <div className="absolute inset-0 bg-black/60" onClick={() => setPasswordModal({ show: false, qna: null })} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
                        >
                            <h3 className="mb-4 text-xl font-bold">비밀번호 확인</h3>
                            <p className="mb-6 text-sm text-white/50">비밀글 조회를 위해 비밀번호를 입력해주세요.</p>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="비밀번호"
                                autoFocus
                            />
                            {passwordError && <p className="mb-4 text-xs text-red-400">{passwordError}</p>}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPasswordModal({ show: false, qna: null })}
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/5"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold transition-all hover:bg-blue-700"
                                >
                                    확인
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
