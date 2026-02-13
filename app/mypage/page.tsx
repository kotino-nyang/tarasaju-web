"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import { useCart } from "@/contexts/CartContext";
import { maskName, maskEmail } from "@/lib/utils/nameMask";
import ReviewForm from "@/components/reviews/ReviewForm";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { AnimatePresence } from "framer-motion";

export default function MyPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { items, removeItem } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [qnaList, setQnaList] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    } else if (user) {
      loadOrders();
      loadReviews();
      loadQnA();
    }
  }, [user, isLoading, router]);

  const loadOrders = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
  };

  const loadReviews = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        orders (
          order_number,
          product_name
        )
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  const loadQnA = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("qna")
      .select("*")
      .eq("user_id", user?.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQnaList(data);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      pending: { label: "입금대기", class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      confirmed: { label: "입금확인", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
      processing: { label: "분석중", class: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
      completed: { label: "완료", class: "bg-green-500/10 text-green-400 border-green-500/20" },
      cancelling: { label: "취소 요청중", class: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
      cancelled: { label: "주문 취소", class: "bg-red-500/10 text-red-500 border-red-500/20" },
    };

    const { label, class: className } = statusMap[status] || statusMap.pending;
    return (
      <span className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${className}`}>
        {label}
      </span>
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 모든 주문 내역과 작성한 리뷰, Q&A가 삭제되며 복구할 수 없습니다.")) {
      return;
    }

    if (!confirm("한 번 더 확인합니다. 정말 탈퇴하시겠습니까?")) {
      return;
    }

    try {
      const supabase = createClient();

      // 사용자의 계정 삭제 (Supabase Auth)
      const { error } = await supabase.auth.admin.deleteUser(user!.id);

      if (error) {
        // admin API가 없으면 클라이언트에서 직접 삭제 시도
        const { error: updateError } = await supabase.auth.updateUser({
          data: { deleted: true }
        });

        if (updateError) throw updateError;
      }

      alert("회원 탈퇴가 완료되었습니다.");
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("회원 탈퇴 처리 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
    }
  };

  const isFileExpired = (fileUploadedAt: string | null) => {
    if (!fileUploadedAt) return false;
    const uploadDate = new Date(fileUploadedAt);
    const now = new Date();
    const diffDays = (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string, couponId: string | null) => {
    if (!confirm(`주문번호 ${orderNumber}를 취소하시겠습니까?`)) {
      return;
    }

    const supabase = createClient();

    try {
      // 주문 상태를 취소 요청중으로 변경
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          order_status: "cancelling",
          payment_status: "cancelling",
        })
        .eq("id", orderId);

      if (orderError) throw orderError;

      // 쿠폰을 사용한 주문이었다면 쿠폰 복구
      if (couponId) {
        const { error: couponError } = await supabase
          .from("user_coupons")
          .update({
            is_used: false,
            used_at: null,
          })
          .eq("coupon_id", couponId)
          .eq("user_id", user?.id);

        if (couponError) {
          console.error("쿠폰 복구 실패:", couponError);
        }
      }

      alert("주문 취소 요청이 완료되었습니다.");
      loadOrders(); // 주문 목록 새로고침
    } catch (error) {
      console.error("주문 취소 실패:", error);
      alert("주문 취소 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050d1a]">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-blue-500"></div>
          <p className="text-white/60">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

        <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header / Profile */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all hover:bg-white/[0.07]">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg">
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#050d1a] text-2xl font-bold text-white">
                      {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase() || "U"}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-[#050d1a] bg-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    안녕하세요, <span className="text-[#60a5fa]">{user.user_metadata?.full_name || user.user_metadata?.name || "회원"}</span>님
                  </h1>
                  <p className="mt-1 text-sm text-white/40">{maskEmail(user.email || "")}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10 active:scale-95"
                >
                  로그아웃
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 active:scale-95"
                >
                  회원탈퇴
                </button>
              </div>
            </div>

            {/* Shopping Cart Section */}
            <section className="mb-12">
              <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                장바구니
              </h2>
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                {items.length === 0 ? (
                  <div className="p-12 text-center text-white/30">
                    <p className="mb-4 text-lg italic">장바구니가 비어있습니다.</p>
                    <Link
                      href="/analysis"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                      쇼핑하러 가기
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-colors">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{item.title}</h3>
                          <p className="text-sm text-white/40 mb-2">{item.option}</p>
                          <p className="text-lg font-bold text-[#60a5fa]">{item.price.toLocaleString()}원</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-xl p-3 text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="bg-white/5 p-6 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-white/60">총 결제금액</span>
                        <span className="text-3xl font-black text-[#60a5fa]">
                          {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}원
                        </span>
                      </div>
                      <Link
                        href="/checkout?fromCart=true"
                        className="block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-center text-base font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                      >
                        결제하기
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Main Sections Grid */}
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-8">
                {/* Order History */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      최근 주문 내역
                    </h2>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    {orders.length === 0 ? (
                      <div className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <p className="text-white/40">아직 주문하신 내역이 없습니다.</p>
                        <Link href="/analysis" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                          분석 시작하기
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10">
                        {orders.map((order) => (
                          <div key={order.id} className="p-6 transition-all hover:bg-white/[0.02]">
                            <div className="mb-4 flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                  <span className="h-1 w-1 rounded-full bg-white/20" />
                                  <span>{order.order_number}</span>
                                </div>
                                <h3 className="text-lg font-bold">{order.product_name}</h3>
                                <p className="text-sm text-white/60">{order.option} · {order.customer_name}</p>
                              </div>
                              {getStatusBadge(order.order_status)}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="text-xl font-bold text-[#60a5fa]">
                                {order.final_amount.toLocaleString()}원
                                {order.discount_amount > 0 && (
                                  <span className="ml-2 text-xs font-medium text-red-400/80">
                                    (-{order.discount_amount.toLocaleString()}원 할인)
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {order.order_status === "completed" && order.result_file_url && !isFileExpired(order.file_uploaded_at) && (
                                  <a
                                    href={order.result_file_url}
                                    download
                                    className="rounded-xl border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400 transition-all hover:bg-blue-500/20"
                                  >
                                    결과 다운로드
                                  </a>
                                )}
                                {order.order_status === "completed" && !reviews.some((r: any) => r.order_id === order.id) && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrderForReview(order);
                                      setShowReviewModal(true);
                                    }}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold transition-all hover:bg-white/20"
                                  >
                                    구매평 작성
                                  </button>
                                )}
                                {order.order_status === "pending" && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id, order.order_number, order.coupon_id)}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white"
                                  >
                                    주문취소
                                  </button>
                                )}
                              </div>
                            </div>

                            {order.order_status === "pending" && (
                              <div className="mt-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 p-4 text-sm">
                                <p className="font-bold text-blue-400 mb-1">입금 대기 정보</p>
                                <p className="text-white/60 leading-relaxed">
                                  카카오뱅크 3333-36-585986 (고수빈) <br />
                                  주문자명 <span className="text-white font-bold">{order.customer_name}</span>으로
                                  금액 <span className="text-white font-bold">{order.final_amount.toLocaleString()}원</span>을 입금해주세요.
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar: Cart Stats */}
              <div className="lg:col-span-4 space-y-8">
                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/40 mb-1">완료 리포트</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.order_status === 'completed').length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/40 mb-1">작성 구매평</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Q&A and Reviews */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* My Reviews */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    나의 구매평
                  </h2>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden divide-y divide-white/10">
                  {reviews.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-white/30 italic">작성하신 구매평이 없습니다.</p>
                    </div>
                  ) : (
                    reviews.map((review: any) => (
                      <div key={review.id} className="p-6 transition-all hover:bg-white/[0.02]">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white/80">{review.orders?.product_name}</h3>
                            <p className="text-xs text-white/40">주문번호: {review.orders?.order_number}</p>
                          </div>
                          <div className="flex gap-0.5 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-white/10 fill-current'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                        <div className="mt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/30">
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                          <span className="h-1 w-1 rounded-full bg-white/10" />
                          {review.is_approved ? (
                            <span className="text-green-400/80">승인됨</span>
                          ) : (
                            <span className="text-yellow-400/80">승인 대기중</span>
                          )}
                        </div>
                        {review.admin_reply && (
                          <div className="mt-4 rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                            <p className="text-[10px] font-black uppercase text-blue-400 mb-1 tracking-widest text-center md:text-left">답변</p>
                            <p className="text-xs text-blue-300 leading-relaxed">{review.admin_reply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* My Q&A */}
              <section>
                <div className="mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    나의 문의 내역
                  </h2>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden divide-y divide-white/10">
                  {qnaList.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-white/30 italic">문의 내역이 없습니다.</p>
                    </div>
                  ) : (
                    qnaList.map((qna: any) => (
                      <div key={qna.id} className="p-6 transition-all hover:bg-white/[0.02]">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white/80">{qna.product_name || "사주 분석 서비스"}</h3>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{new Date(qna.created_at).toLocaleDateString()}</p>
                          </div>
                          {qna.is_answered ? (
                            <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[9px] font-black text-green-400 uppercase">Answered</span>
                          ) : (
                            <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-black text-white/20 uppercase">Pending</span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">{qna.question}</p>
                        {qna.answer && (
                          <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-4">
                            <p className="text-[10px] font-black uppercase text-green-400 mb-1 tracking-widest text-center md:text-left">공식 답변</p>
                            <p className="text-xs text-green-300 leading-relaxed">{qna.answer}</p>
                            {qna.answered_at && (
                              <p className="text-[9px] text-green-500/40 mt-2 text-right">{new Date(qna.answered_at).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      {showReviewModal && selectedOrderForReview && (
        <ReviewForm
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrderForReview(null);
            loadReviews();
          }}
          productName={selectedOrderForReview.product_name}
          orderId={selectedOrderForReview.id}
        />
      )}
    </div>
  );
}
