"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import { useCart } from "@/contexts/CartContext";

export default function MyPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { items, removeItem } = useCart();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    } else if (user) {
      loadOrders();
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img
                src="https://i.imgur.com/sdU9nRt.png"
                alt="타라사주 로고"
                className="h-12 w-auto md:h-14"
                onError={(e) => {
                  e.currentTarget.src = "https://i.imgur.com/sdU9nRt.jpg";
                }}
              />
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
            >
              로그아웃
            </button>
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
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-2 border-gray-200"
                />
              )}
              <div>
                <h1 className="mb-1 text-3xl font-light text-gray-900">
                  안녕하세요, {user.user_metadata?.full_name || user.user_metadata?.name || "회원"}님
                </h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Shopping Cart Section */}
          <div className="mb-12">
            <h2 className="mb-4 text-xl font-medium text-gray-900">장바구니</h2>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {items.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="mb-2 text-lg font-medium text-gray-700">
                    장바구니가 비어있습니다
                  </p>
                  <Link
                    href="/analysis"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    쇼핑하러 가기
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="tex-base font-medium text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-1">{item.option}</p>
                        <p className="text-sm font-bold text-blue-600">{item.price.toLocaleString()}원</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="bg-gray-50 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-900">총 결제금액</span>
                      <span className="text-xl font-bold text-blue-600">
                        {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}원
                      </span>
                    </div>
                    <Link
                      href="/checkout?fromCart=true"
                      className="block w-full rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      결제하기
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div>
            <h2 className="mb-4 text-xl font-medium text-gray-900">주문내역</h2>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto mb-4 h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="mb-2 text-lg font-medium text-gray-700">
                    주문 내역이 없습니다
                  </p>
                  <p className="mb-6 text-sm text-gray-500">
                    사주 분석 서비스를 신청하고 나만의 리포트를 받아보세요
                  </p>
                  <Link
                    href="/analysis"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    사주 분석 신청하기
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            주문일: {new Date(order.created_at).toLocaleDateString("ko-KR")}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            주문번호: {order.order_number}
                          </p>
                        </div>
                        {getStatusBadge(order.order_status)}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 mb-1">
                            {order.product_name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {order.option} - {order.customer_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-blue-600">
                              {order.final_amount.toLocaleString()}원
                            </span>
                            {order.discount_amount > 0 && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  {order.price.toLocaleString()}원
                                </span>
                                <span className="text-xs text-red-500 font-medium">
                                  {order.discount_amount.toLocaleString()}원 할인
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {order.order_status === "pending" && (
                        <>
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800">
                              <strong>입금 계좌:</strong> 카카오뱅크 3333-36-585986 (고수빈)
                            </p>
                            <p className="text-xs text-yellow-800 mt-1">
                              입금자명을 주문자명({order.customer_name})으로 입금해주세요.
                            </p>
                          </div>
                          <button
                            onClick={() => handleCancelOrder(order.id, order.order_number, order.coupon_id)}
                            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400"
                          >
                            주문 취소
                          </button>
                        </>
                      )}
                      {order.order_status === "completed" && order.result_file_url && (
                        <div className="mt-4">
                          {isFileExpired(order.file_uploaded_at) ? (
                            <div className="flex items-center justify-center gap-2 w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500 border border-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              다운로드 기간 만료 (30일 경과)
                            </div>
                          ) : (
                            <a
                              href={order.result_file_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              분석 결과 다운로드 (30일 이내)
                            </a>
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
    </div>
  );
}
