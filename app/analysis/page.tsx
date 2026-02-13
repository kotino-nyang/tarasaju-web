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
                className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white pt-32 pb-20"
            >
                <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">

                    {/* Top Section: Product Info */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-20">
                        {/* Left: Thumbnail */}
                        <div className="w-full lg:w-1/3">
                            <div className="aspect-square w-full relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                                <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                    BEST
                                </span>
                                <span className="ml-2 inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                    30명 한정 특가
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">[불만족시 100%환불] 종합사주분석</h1>
                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-lg text-gray-400 line-through">64,500원</span>
                                <p className="text-3xl font-bold text-blue-600">29,800원</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-4 mb-6">
                                {/* 기본 1인 */}
                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">종합사주분석 1인</p>
                                            <p className="text-xs text-gray-500 mt-1">29,800원</p>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
                                            <span className="text-gray-900 font-medium">1</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 추가 인원 */}
                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">종합사주분석 1인 추가</p>
                                            <p className="text-xs text-gray-500 mt-1">+24,500원 / 1인</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setAdditionalQuantity(Math.max(0, additionalQuantity - 1))}
                                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                disabled={additionalQuantity === 0}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-gray-900 font-medium">{additionalQuantity}</span>
                                            <button
                                                onClick={() => setAdditionalQuantity(additionalQuantity + 1)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 총 금액 표시 */}
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">총 {totalPeople}명</p>
                                            <p className="text-xs text-gray-600 mt-1">분석 대상 인원</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-sm text-gray-500 mb-6">*본 상품은 디지털 상품으로 배송이 없습니다.</p>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    장바구니
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    className="flex-1 rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Tabs & Content */}
                    <div className="w-full">
                        {/* Tabs Navigation */}
                        <div className="sticky top-20 z-10 flex border-b border-gray-200 bg-white/95 backdrop-blur-sm mb-8">
                            {["detail", "reviews", "qna"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-4 text-sm md:text-base font-medium transition-colors ${activeTab === tab
                                        ? "border-b-2 border-gray-400 text-gray-700"
                                        : "text-gray-400 hover:text-gray-600"
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
                                <div className="animate-in fade-in duration-300">
                                    {reviews.length === 0 ? (
                                        <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                                            <p className="mb-2 text-lg font-medium text-gray-700">등록된 구매평이 없습니다.</p>
                                            <p className="mb-6 text-sm">첫 번째 구매평을 남겨주세요!</p>
                                            <button
                                                onClick={() => setShowReviewModal(true)}
                                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                구매평 작성
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 flex justify-end">
                                                <button
                                                    onClick={() => setShowReviewModal(true)}
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                >
                                                    구매평 작성
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {reviews.map((review: any) => (
                                                    <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                                        <div className="flex gap-4 mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <p className="font-medium text-gray-900">{review.orders?.customer_name?.charAt(0)}**</p>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(review.created_at).toLocaleDateString("ko-KR")}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 mb-3">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <svg
                                                                            key={star}
                                                                            className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                                <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
                                                            </div>
                                                            {review.image_url && (
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        src={review.image_url}
                                                                        alt="Review"
                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {review.admin_reply && (
                                                            <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 p-4">
                                                                <p className="text-sm font-medium text-blue-900 mb-1">관리자 답변</p>
                                                                <p className="text-sm text-blue-800 whitespace-pre-wrap">{review.admin_reply}</p>
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
                                        <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                                            <p className="mb-2 text-lg font-medium text-gray-700">등록된 Q&A가 없습니다.</p>
                                            <p className="mb-6 text-sm">궁금한 점이 있다면 문의해주세요.</p>
                                            <button
                                                onClick={() => setShowQnAModal(true)}
                                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                            >
                                                상품문의
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 flex justify-end">
                                                <button
                                                    onClick={() => setShowQnAModal(true)}
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
                                                            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${isLocked ? "cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" : ""}`}
                                                            onClick={() => isLocked && handleQnAClick(qna)}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-900">{qna.author_name?.charAt(0)}**</p>
                                                                    {!qna.is_public && (
                                                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(qna.created_at).toLocaleDateString("ko-KR")}
                                                                    </span>
                                                                </div>
                                                                {qna.is_answered ? (
                                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                                        답변완료
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                                        답변대기
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mb-3">
                                                                <p className="text-sm font-medium text-gray-500 mb-1">질문</p>
                                                                <p className="text-gray-700 whitespace-pre-wrap">{qna.question}</p>
                                                            </div>

                                                            {!isLocked && qna.answer && (
                                                                <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                                                                    <p className="text-sm font-medium text-green-900 mb-1">답변</p>
                                                                    <p className="text-sm text-green-800 whitespace-pre-wrap">{qna.answer}</p>
                                                                </div>
                                                            )}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6 shadow-2xl">
                        <button
                            onClick={() => {
                                setPasswordModal({ show: false, qna: null });
                                setPasswordInput("");
                                setPasswordError("");
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">비공개 문의</h3>
                            <p className="text-sm text-gray-600">
                                이 문의는 비밀번호로 보호되어 있습니다.<br />
                                비밀번호를 입력해주세요.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
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
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPasswordModal({ show: false, qna: null });
                                        setPasswordInput("");
                                        setPasswordError("");
                                    }}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm"
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
