"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { motion } from "framer-motion";
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
                className="relative min-h-screen overflow-hidden bg-[#051124] pt-32 pb-20"
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)] opacity-20" />
                <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">

                    {/* Top Section: Product Info */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
                        {/* Left: Thumbnail */}
                        <div className="w-full lg:w-1/3">
                            <div className="aspect-square w-full relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl group">
                                <img
                                    src="/detail image/thumnail.png"
                                    alt="[불만족시 100%환불] 종합사주분석"
                                    className="object-cover w-full h-full select-none group-hover:scale-110 transition-transform duration-700"
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable={false}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Right: Product Details & Actions */}
                        {/* Right: Booking Form */}
                        <div className="w-full lg:w-2/3 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest">Premium Analysis</span>
                                        <div className="h-1 w-1 rounded-full bg-white/20" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Direct Expert</span>
                                    </div>
                                    <h1 className="text-4xl font-black text-white md:text-5xl mb-6 tracking-tight">종합 사주 분석</h1>
                                    <p className="text-white/60 text-lg leading-relaxed font-medium">
                                        당신의 운명을 파헤치고 더 나은 미래를 설계하세요.<br />
                                        전문 분석가가 직접 분석해 드립니다.
                                    </p>
                                </div>

                                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-50" />
                                    <div className="relative flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Investment</p>
                                            <div className="text-4xl font-black text-blue-400">
                                                {totalPrice.toLocaleString()}원
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl px-5 py-3 shadow-inner">
                                            <button
                                                onClick={() => setAdditionalQuantity(Math.max(0, additionalQuantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-all active:scale-90"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="text-2xl font-black min-w-[3.5rem] text-center text-white">{totalPeople}인</span>
                                            <button
                                                onClick={() => setAdditionalQuantity(additionalQuantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            addItem({
                                                id: "comprehensive-analysis",
                                                title: "종합 사주 분석",
                                                option: "기본 1인",
                                                price: basePrice,
                                                image: "/detail image/thumnail.png"
                                            });
                                            if (additionalQuantity > 0) {
                                                addItem({
                                                    id: "additional-person",
                                                    title: "추가 인원 분석",
                                                    option: `${additionalQuantity}인 추가`,
                                                    price: additionalPrice * additionalQuantity,
                                                    image: "/detail image/thumnail.png"
                                                });
                                            }
                                            router.push("/checkout");
                                        }}
                                        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-6 text-xl font-black text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        구매하기
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mb-12">
                        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                            {[
                                { id: "detail", label: "상세설명" },
                                { id: "reviews", label: `구매평 (${reviews.length})` },
                                { id: "qna", label: `문의하기 (${qnaList.length})` }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative whitespace-nowrap px-6 py-4 text-sm font-bold transition-all ${activeTab === tab.id ? "text-blue-400" : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 h-1 w-full bg-blue-500 rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {activeTab === "detail" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-12"
                                >
                                    <div className="flex flex-col items-center max-w-4xl mx-auto">
                                        <img
                                            src="/detail image/1.png"
                                            alt="Detail 1"
                                            className="w-full h-auto object-contain mb-0 select-none brightness-90"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                        <img
                                            src="/detail image/2.gif"
                                            alt="Detail 2"
                                            className="w-full h-auto object-contain mb-0 select-none brightness-90"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                        <img
                                            src="/detail image/3.png"
                                            alt="Detail 3"
                                            className="w-full h-auto object-contain mb-0 select-none brightness-90"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                        <img
                                            src="/detail image/4.gif"
                                            alt="Detail 4"
                                            className="w-full h-auto object-contain mb-0 select-none brightness-90"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                        <img
                                            src="/detail image/5.png"
                                            alt="Detail 5"
                                            className="w-full h-auto object-contain mb-0 select-none brightness-90"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="animate-in fade-in duration-300">
                                    {reviews.length === 0 ? (
                                        <div className="py-12 text-center border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-xl">
                                            <p className="mb-2 text-lg font-bold text-white">등록된 구매평이 없습니다.</p>
                                            <p className="mb-6 text-sm text-white/40">첫 번째 구매평을 남겨주세요!</p>
                                            <button
                                                onClick={() => setShowReviewModal(true)}
                                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                                            >
                                                구매평 작성
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6 flex justify-end">
                                                <button
                                                    onClick={() => setShowReviewModal(true)}
                                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                                >
                                                    구매평 작성
                                                </button>
                                            </div>
                                            <div className="space-y-6">
                                                {reviews.map((review: any) => (
                                                    <div key={review.id} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl group hover:border-blue-500/20 transition-all">
                                                        <div className="flex flex-col md:flex-row gap-6">
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                                            <span className="text-blue-400 font-bold uppercase">{review.orders?.customer_name?.charAt(0)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-white">{review.orders?.customer_name?.charAt(0)}**</p>
                                                                            <span className="text-xs text-white/40">
                                                                                {new Date(review.created_at).toLocaleDateString("ko-KR")}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <svg
                                                                                key={star}
                                                                                className={`w-4 h-4 ${star <= review.rating ? "text-blue-400" : "text-white/10"}`}
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{review.content}</p>
                                                            </div>
                                                            {review.image_url && (
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        src={review.image_url}
                                                                        alt="Review"
                                                                        className="w-full md:w-32 aspect-square object-cover rounded-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {review.admin_reply && (
                                                            <div className="mt-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 p-5">
                                                                <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                                    </svg>
                                                                    관리자 답변
                                                                </div>
                                                                <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{review.admin_reply}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === "qna" && (
                                <div className="animate-in fade-in duration-300">
                                    {qnaList.length === 0 ? (
                                        <div className="py-12 text-center border border-white/10 bg-white/5 rounded-3xl backdrop-blur-xl shadow-xl">
                                            <p className="mb-2 text-lg font-bold text-white">등록된 Q&A가 없습니다.</p>
                                            <p className="mb-6 text-sm text-white/40">궁금한 점이 있다면 문의해주세요.</p>
                                            <button
                                                onClick={() => setShowQnAModal(true)}
                                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                                            >
                                                상품문의
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6 flex justify-end">
                                                <button
                                                    onClick={() => setShowQnAModal(true)}
                                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                                >
                                                    상품문의
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {qnaList.map((qna: any) => {
                                                    const isLocked = !qna.is_public && !unlockedQnAIds.has(qna.id);
                                                    return (
                                                        <div
                                                            key={qna.id}
                                                            className={`rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl group transition-all ${isLocked ? "cursor-pointer hover:border-blue-500/40" : "hover:border-white/20"}`}
                                                            onClick={() => isLocked && handleQnAClick(qna)}
                                                        >
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold text-white/40">
                                                                        {qna.author_name?.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white/80">{qna.author_name?.charAt(0)}**</p>
                                                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">
                                                                            {new Date(qna.created_at).toLocaleDateString("ko-KR")}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    {!qna.is_public && (
                                                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                                            <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    {qna.is_answered ? (
                                                                        <span className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-tighter">
                                                                            답변완료
                                                                        </span>
                                                                    ) : (
                                                                        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black text-white/40 border border-white/10 uppercase tracking-tighter">
                                                                            답변대기
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{qna.question}</p>
                                                                </div>

                                                                {!isLocked && qna.answer && (
                                                                    <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-5 mt-4">
                                                                        <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                                            </svg>
                                                                            관리자 답변
                                                                        </div>
                                                                        <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{qna.answer}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modals */}
            {showReviewModal && (
                <ReviewForm
                    onClose={() => {
                        setShowReviewModal(false);
                        loadReviews();
                    }}
                    productName="[불만족시 100%환불] 종합사주분석"
                />
            )}
            {showQnAModal && (
                <QnAForm
                    onClose={() => setShowQnAModal(false)}
                    onSuccess={() => loadQnA()}
                    productName="[불만족시 100%환불] 종합사주분석"
                />
            )}

            {/* Password Modal for Private Q&A */}
            {passwordModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050d1a]/80 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a]/90 border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                        <button
                            onClick={() => {
                                setPasswordModal({ show: false, qna: null });
                                setPasswordInput("");
                                setPasswordError("");
                            }}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">비공개 문의</h3>
                            <p className="text-sm text-white/40">
                                이 문의는 비밀번호로 보호되어 있습니다.<br />
                                비밀번호를 입력해주세요.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2 ml-1">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => {
                                        setPasswordInput(e.target.value);
                                        setPasswordError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handlePasswordSubmit();
                                        }
                                    }}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-sm text-red-400 mt-2 ml-1 font-medium">{passwordError}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPasswordModal({ show: false, qna: null });
                                        setPasswordInput("");
                                        setPasswordError("");
                                    }}
                                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
