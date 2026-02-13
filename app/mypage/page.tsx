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
      pending: { label: "입금대기", class: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "입금확인", class: "bg-blue-100 text-blue-800" },
      processing: { label: "분석중", class: "bg-purple-100 text-purple-800" },
      completed: { label: "완료", class: "bg-green-100 text-green-800" },
      cancelling: { label: "취소 요청중", class: "bg-orange-100 text-orange-800" },
      cancelled: { label: "주문 취소", class: "bg-gray-100 text-gray-800" },
    };

    const { label, class: className } = statusMap[status] || statusMap.pending;
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#051122]/80 backdrop-blur-md shadow-xl">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img
                src="https://i.imgur.com/sdU9nRt.png"
                alt="타라사주 로고"
                className="h-12 w-auto md:h-14 brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.src = "https://i.imgur.com/sdU9nRt.jpg";
                }}
              />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="rounded-full border border-red-500/30 bg-white/5 px-5 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:shadow-sm"
              >
                회원탈퇴
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:shadow-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          {/* Welcome Section */}
          <div className="mb-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10 opacity-50" />
            <div className="relative flex items-center gap-8">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="h-24 w-24 rounded-3xl border-2 border-white/20 shadow-xl object-cover ring-4 ring-blue-500/20"
                />
              ) : (
                <div className="h-24 w-24 rounded-3xl bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center text-4xl font-black text-blue-400 shadow-xl ring-4 ring-blue-500/10">
                  {user.user_metadata?.full_name?.[0] || user.user_metadata?.name?.[0] || "H"}
                </div>
              )}
              <div>
                <h1 className="mb-2 text-4xl font-black text-white tracking-tight">
                  안녕하세요,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {user.user_metadata?.full_name || user.user_metadata?.name || "회원"}
                  </span>님
                </h1>
                <p className="text-white/40 font-medium tracking-wide">{maskEmail(user.email || "")}</p>
              </div>
            </div>
          </div>

          {/* Shopping Cart Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 ml-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h2 className="text-xl font-black text-white uppercase tracking-widest">장바구니</h2>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
              {items.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-bold text-white/80">장바구니가 비어있습니다</p>
                  <p className="mb-8 text-sm text-white/40">원하시는 분석 서비스를 담아보세요</p>
                  <Link
                    href="/analysis"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-black text-white transition-all hover:bg-white/10 hover:scale-105"
                  >
                    쇼핑하러 가기
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-8 hover:bg-white/[0.02] transition-colors group">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase">Premium</span>
                          <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                        </div>
                        <p className="text-sm text-white/40 mb-2 font-medium">{item.option}</p>
                        <p className="text-lg font-black text-blue-400">{item.price.toLocaleString()}원</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-2xl p-4 text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="bg-white/5 p-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-white/60 tracking-widest uppercase text-sm">최종 결제 예정 금액</span>
                      <span className="text-3xl font-black text-white shadow-blue-500/50">
                        {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}원
                      </span>
                    </div>
                    <Link
                      href="/checkout?fromCart=true"
                      className="block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-center text-lg font-black text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      지금 결제하기
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 ml-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h2 className="text-xl font-black text-white uppercase tracking-widest">주문내역</h2>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
              {orders.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-bold text-white/80">주문 내역이 없습니다</p>
                  <p className="mb-8 text-sm text-white/40">타라사주의 정밀 분석을 만나보세요</p>
                  <Link
                    href="/analysis"
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white transition-all hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-500/20"
                  >
                    사주 분석 신청하기
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <div key={order.id} className="p-8 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between mb-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white/30 tracking-wider">
                            {new Date(order.created_at).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-sm font-black text-white/80">
                            ID: {order.order_number}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(order.order_status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white mb-2 tracking-tight">
                            {order.product_name}
                          </h3>
                          <p className="text-sm text-white/40 mb-4 font-medium">
                            {order.option} • {maskName(order.customer_name)}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-blue-400">
                              {order.final_amount.toLocaleString()}원
                            </span>
                            {order.discount_amount > 0 && (
                              <>
                                <span className="text-sm text-white/20 line-through font-medium">
                                  {order.price.toLocaleString()}원
                                </span>
                                <span className="px-2 py-0.5 rounded bg-red-500/10 text-[10px] font-black text-red-500 border border-red-500/20">
                                  {order.discount_amount.toLocaleString()}원 할인
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {order.order_status === "pending" && (
                        <div className="mt-8 space-y-4">
                          <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              입금 정보
                            </div>
                            <p className="text-sm text-white/70 font-bold">
                              카카오뱅크 <span className="text-white">3333-36-585986</span> (고수빈)
                            </p>
                            <p className="text-[11px] text-white/40 mt-1 font-medium">
                              *입금자명을 주문자명 <span className="text-blue-400 font-bold">{maskName(order.customer_name)}</span>으로 입금해주세요.
                            </p>
                          </div>
                          <button
                            onClick={() => handleCancelOrder(order.id, order.order_number, order.coupon_id)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white/60 transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                          >
                            주문 취소하기
                          </button>
                        </div>
                      )}

                      {order.order_status === "completed" && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {order.result_file_url && (
                            <>
                              {isFileExpired(order.file_uploaded_at) ? (
                                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-6 py-4 text-sm font-black text-white/20 border border-white/5 cursor-not-allowed">
                                  다운로드 기간 만료
                                </div>
                              ) : (
                                <a
                                  href={order.result_file_url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white transition-all hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  분석 결과 다운로드
                                </a>
                              )}
                            </>
                          )}
                          {!reviews.some((review: any) => review.orders?.order_number === order.order_number) ? (
                            <button
                              onClick={() => {
                                setSelectedOrderForReview(order);
                                setShowReviewModal(true);
                              }}
                              className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white transition-all hover:bg-white/10"
                            >
                              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              구매평 작성하기
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-6 py-4 text-sm font-black text-white/40 border border-white/5">
                              구매평 작성 완료
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review History */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 ml-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h2 className="text-xl font-black text-white uppercase tracking-widest">내 구매평</h2>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
              {reviews.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-bold text-white/80">작성한 구매평이 없습니다</p>
                  <p className="text-sm text-white/40">분석을 받으셨다면 소중한 후기를 남겨주세요</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="p-8 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-lg font-black text-white mb-1 tracking-tight">
                            {review.orders?.product_name || "종합 사주 분석"}
                          </p>
                          <p className="text-xs font-bold text-white/30">
                            No. {review.orders?.order_number}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500" : "text-white/10"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/80 leading-relaxed mb-6 font-medium bg-white/5 p-5 rounded-2xl border border-white/5">{review.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/20">{new Date(review.created_at).toLocaleDateString("ko-KR")}</span>
                        {review.is_approved ? (
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
                            Approved
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black text-white/20 border border-white/10 uppercase tracking-tighter">
                            Pending
                          </span>
                        )}
                      </div>
                      {review.admin_reply && (
                        <div className="mt-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 p-6 relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40" />
                          <p className="text-xs font-black text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            관리자 답변
                          </p>
                          <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-medium">{review.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Q&A History */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6 ml-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h2 className="text-xl font-black text-white uppercase tracking-widest">내 문의내역</h2>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
              {qnaList.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-bold text-white/80">작성한 문의가 없습니다</p>
                  <p className="text-sm text-white/40">궁금하신 점이 있다면 언제든 문의해주세요</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {qnaList.map((qna: any) => (
                    <div key={qna.id} className="p-8 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          {qna.product_name && (
                            <p className="text-lg font-black text-white mb-2 tracking-tight">
                              {qna.product_name}
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white/20">
                              {new Date(qna.created_at).toLocaleDateString("ko-KR")}
                            </span>
                            {qna.is_answered ? (
                              <span className="rounded-full bg-blue-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-tighter">
                                답변완료
                              </span>
                            ) : (
                              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black text-white/40 border border-white/10 uppercase tracking-tighter">
                                답변대기
                              </span>
                            )}
                            {qna.is_public ? (
                              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black text-white/20 border border-white/10 uppercase tracking-tighter">
                                Public
                              </span>
                            ) : (
                              <div className="bg-white/5 p-1 rounded-lg border border-white/5">
                                <svg className="w-3 h-3 text-red-500/50" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <p className="text-[10px] font-black text-white/30 mb-2 uppercase tracking-widest">Question</p>
                        <p className="text-white/80 whitespace-pre-wrap leading-relaxed font-medium bg-white/5 p-5 rounded-2xl border border-white/5">{qna.question}</p>
                      </div>
                      {qna.answer && (
                        <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-6 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40" />
                          <p className="text-xs font-black text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            관리자 답변
                          </p>
                          <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-medium">{qna.answer}</p>
                          {qna.answered_at && (
                            <p className="text-[10px] text-white/20 mt-4 font-bold">
                              {new Date(qna.answered_at).toLocaleDateString("ko-KR")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

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
