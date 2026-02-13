"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import QnAManagement from "@/components/admin/QnAManagement";

// 관리자 이메일 목록 (실제 환경에서는 환경변수로 관리)
const ADMIN_EMAILS = ["binzzz010101@gmail.com"];

type AdminSection = "orders" | "reviews" | "qna";
type OrderStatus = "all" | "pending" | "confirmed" | "processing" | "completed" | "cancelling" | "cancelled";

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  product_name: string;
  option: string;
  price: number;
  discount_amount: number;
  final_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  calendar_type: string;
  is_leap_month: boolean;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  coupon_id: string | null;
  result_file_url: string | null;
  file_uploaded_at: string | null;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  // 날짜 필터
  const [dateFilter, setDateFilter] = useState<"all" | "year" | "month" | "day">("all");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    } else if (user) {
      // 관리자 권한 체크
      if (!ADMIN_EMAILS.includes(user.email || "")) {
        alert("관리자 권한이 없습니다.");
        router.push("/");
        return;
      }
      loadOrders();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let filtered = [...orders];

    // 상태 필터
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.order_status === selectedStatus);
    }

    // 날짜 필터
    if (dateFilter !== "all") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;
        const orderDay = orderDate.getDate();

        if (dateFilter === "year") {
          return orderYear === selectedYear;
        } else if (dateFilter === "month") {
          return orderYear === selectedYear && orderMonth === selectedMonth;
        } else if (dateFilter === "day") {
          return orderYear === selectedYear && orderMonth === selectedMonth && orderDay === selectedDay;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, orders, dateFilter, selectedYear, selectedMonth, selectedDay]);

  // 매출 통계 계산
  const calculateStats = () => {
    const completedOrders = filteredOrders.filter(
      (order) => order.order_status === "completed" || order.order_status === "confirmed" || order.order_status === "processing"
    );

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.final_amount, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

    const statusCounts = {
      pending: filteredOrders.filter((o) => o.order_status === "pending").length,
      confirmed: filteredOrders.filter((o) => o.order_status === "confirmed").length,
      processing: filteredOrders.filter((o) => o.order_status === "processing").length,
      completed: filteredOrders.filter((o) => o.order_status === "completed").length,
      cancelling: filteredOrders.filter((o) => o.order_status === "cancelling").length,
      cancelled: filteredOrders.filter((o) => o.order_status === "cancelled").length,
    };

    return { totalRevenue, totalOrders, avgOrderValue, statusCounts, completedOrders: completedOrders.length };
  };

  const stats = calculateStats();

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
      setFilteredOrders(data);
    } else {
      console.error("주문 로딩 실패:", error);
    }
    setIsLoadingOrders(false);
  };

  const updateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        order_status: orderStatus,
        payment_status: paymentStatus,
      })
      .eq("id", orderId);

    if (error) {
      alert("주문 상태 업데이트 실패: " + error.message);
      console.error(error);
    } else {
      alert("주문 상태가 업데이트되었습니다.");
      loadOrders();
      setSelectedOrder(null);
    }
  };

  const confirmPayment = (order: Order) => {
    if (confirm(`주문번호 ${order.order_number}의 입금을 확인하시겠습니까?`)) {
      updateOrderStatus(order.id, "confirmed", "confirmed");
    }
  };

  const startProcessing = (order: Order) => {
    if (confirm(`주문번호 ${order.order_number}를 분석 시작으로 변경하시겠습니까?`)) {
      updateOrderStatus(order.id, "processing", "confirmed");
    }
  };

  const handleFileUpload = async (order: Order, file: File) => {
    if (!file) return;

    // 파일 크기 체크 (30MB)
    if (file.size > 30 * 1024 * 1024) {
      alert("파일 크기는 30MB 이하여야 합니다.");
      return;
    }

    // 파일 형식 체크
    const allowedTypes = ["application/pdf", "application/zip", "application/x-zip-compressed"];
    if (!allowedTypes.includes(file.type)) {
      alert("PDF 또는 ZIP 파일만 업로드 가능합니다.");
      return;
    }

    setUploadingFile(order.id);
    const supabase = createClient();

    try {
      const fileExt = file.name.split(".").pop();

      // 저장용 파일명: 타임스탬프 + 랜덤문자열 (URL-safe)
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const safeFileName = `${timestamp}_${randomStr}.${fileExt}`;
      const filePath = `${order.user_id}/${safeFileName}`;

      // 다운로드용 한글 파일명
      const koreanFileName = `${order.order_number}_${order.customer_name}.${fileExt}`;

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from("order-results")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Public URL 생성
      const { data: urlData } = supabase.storage
        .from("order-results")
        .getPublicUrl(filePath, {
          download: koreanFileName, // 다운로드 시 한글 파일명 사용
        });

      // orders 테이블 업데이트 (파일 URL 저장 + 완료 상태로 변경 + 업로드 시간 기록)
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          result_file_url: urlData.publicUrl,
          order_status: "completed",
          payment_status: "completed",
          file_uploaded_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) throw updateError;

      alert("파일이 업로드되고 주문이 완료 처리되었습니다.");
      loadOrders();
    } catch (error: any) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 실패: " + error.message);
    } finally {
      setUploadingFile(null);
    }
  };

  const completeOrder = (order: Order) => {
    if (confirm(`주문번호 ${order.order_number}를 완료 처리하시겠습니까?`)) {
      updateOrderStatus(order.id, "completed", "completed");
    }
  };

  const cancelOrder = async (order: Order) => {
    if (!confirm(`주문번호 ${order.order_number}를 취소 완료 처리하시겠습니까?`)) {
      return;
    }

    const supabase = createClient();

    try {
      // 주문 취소 완료
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          order_status: "cancelled",
          payment_status: "cancelled",
        })
        .eq("id", order.id);

      if (orderError) throw orderError;

      // 쿠폰 복구 (이미 복구되었을 수 있지만 안전하게 다시 처리)
      if (order.coupon_id) {
        const { error: couponError } = await supabase
          .from("user_coupons")
          .update({
            is_used: false,
            used_at: null,
          })
          .eq("coupon_id", order.coupon_id)
          .eq("user_id", order.user_id);

        if (couponError) {
          console.error("쿠폰 복구 실패:", couponError);
        }
      }

      alert("주문 취소가 완료되었습니다.");
      loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("주문 취소 실패:", error);
      alert("주문 취소 중 오류가 발생했습니다.");
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

  const getStatusCount = (status: OrderStatus) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.order_status === status).length;
  };

  if (isLoading || isLoadingOrders) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
              <h1 className="text-base md:text-xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <button
              onClick={() => router.push("/mypage")}
              className="rounded-full border border-gray-300 bg-white px-3 md:px-5 py-2 text-xs md:text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm active:bg-gray-100"
            >
              <span className="hidden sm:inline">마이페이지로</span>
              <span className="sm:hidden">마이페이지</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Section Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            {[
              { value: "orders", label: "주문 관리" },
              { value: "reviews", label: "구매평 관리" },
              { value: "qna", label: "Q&A 관리" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveSection(tab.value as AdminSection)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === tab.value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Orders Section */}
          {activeSection === "orders" && (
            <>
              {/* 매출 통계 */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <p className="text-xs md:text-sm text-gray-500 mb-1">총 매출</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.totalRevenue.toLocaleString()}원</p>
              <p className="text-xs text-gray-400 mt-1 hidden md:block">완료된 주문 기준</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <p className="text-xs md:text-sm text-gray-500 mb-1">총 주문</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.totalOrders}건</p>
              <p className="text-xs text-gray-400 mt-1">완료: {stats.completedOrders}건</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <p className="text-xs md:text-sm text-gray-500 mb-1">평균 주문액</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{Math.round(stats.avgOrderValue).toLocaleString()}원</p>
              <p className="text-xs text-gray-400 mt-1 hidden md:block">완료된 주문 평균</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs md:text-sm text-gray-500 mb-2">상태별 주문</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>입금대기:</span><span className="font-medium">{stats.statusCounts.pending}건</span></div>
                <div className="flex justify-between"><span>분석중:</span><span className="font-medium">{stats.statusCounts.processing}건</span></div>
              </div>
            </div>
          </div>

          {/* 날짜 필터 */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">기간 선택</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as "all" | "year" | "month" | "day")}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">전체</option>
                  <option value="year">연도별</option>
                  <option value="month">월별</option>
                  <option value="day">일별</option>
                </select>
              </div>

              {dateFilter !== "all" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">연도</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>{year}년</option>
                      ))}
                    </select>
                  </div>

                  {(dateFilter === "month" || dateFilter === "day") && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">월</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>{month}월</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {dateFilter === "day" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">일</label>
                      <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>{day}일</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setDateFilter("all");
                      setSelectedYear(new Date().getFullYear());
                      setSelectedMonth(new Date().getMonth() + 1);
                      setSelectedDay(new Date().getDate());
                    }}
                    className="mt-7 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    초기화
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 border-b border-gray-200 pb-2">
              {[
                { value: "all", label: "전체" },
                { value: "pending", label: "입금대기" },
                { value: "confirmed", label: "입금확인" },
                { value: "processing", label: "분석중" },
                { value: "completed", label: "완료" },
                { value: "cancelling", label: "취소요청" },
                { value: "cancelled", label: "취소완료" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value as OrderStatus)}
                  className={`whitespace-nowrap rounded-lg px-3 md:px-4 py-2.5 md:py-2 text-xs md:text-sm font-medium transition-colors ${
                    selectedStatus === status.value
                      ? "bg-blue-600 text-white active:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 active:bg-gray-100"
                  }`}
                >
                  {status.label} ({getStatusCount(status.value as OrderStatus)})
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <p className="text-gray-500">해당 상태의 주문이 없습니다.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{order.order_number}</h3>
                        {getStatusBadge(order.order_status)}
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">주문일시:</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.created_at).toLocaleString("ko-KR")}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">상품:</p>
                          <p className="font-medium text-gray-900">{order.product_name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">옵션:</p>
                          <p className="font-medium text-gray-900">{order.option}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">결제금액:</p>
                          <p className="font-bold text-blue-600">
                            {order.final_amount.toLocaleString()}원
                            {order.discount_amount > 0 && (
                              <span className="ml-2 text-xs text-gray-500 line-through">
                                {order.price.toLocaleString()}원
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">주문자:</p>
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">연락처:</p>
                          <p className="font-medium text-gray-900">{order.customer_phone}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <p className="text-gray-500">이메일:</p>
                          <p className="font-medium text-gray-900">{order.customer_email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {selectedOrder?.id === order.id ? "상세정보 닫기 ▲" : "상세정보 보기 ▼"}
                      </button>

                      {/* Detailed Info */}
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                          <h4 className="mb-3 font-bold text-gray-900">사주 정보</h4>
                          <div className="grid gap-2 text-sm">
                            <div className="grid grid-cols-2 gap-x-4">
                              <p className="text-gray-500">성별:</p>
                              <p className="font-medium text-gray-900">{order.gender === "male" ? "남성" : "여성"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4">
                              <p className="text-gray-500">생년월일:</p>
                              <p className="font-medium text-gray-900">{order.birth_date}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4">
                              <p className="text-gray-500">출생시간:</p>
                              <p className="font-medium text-gray-900">{order.birth_time}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4">
                              <p className="text-gray-500">달력종류:</p>
                              <p className="font-medium text-gray-900">
                                {order.calendar_type === "solar" ? "양력" : "음력"}
                                {order.calendar_type === "lunar" && order.is_leap_month && " (윤달)"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      {order.order_status === "pending" && (
                        <button
                          onClick={() => confirmPayment(order)}
                          className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                        >
                          입금 확인
                        </button>
                      )}

                      {order.order_status === "confirmed" && (
                        <button
                          onClick={() => startProcessing(order)}
                          className="rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
                        >
                          분석 시작
                        </button>
                      )}

                      {order.order_status === "processing" && (
                        <>
                          <label className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 active:bg-green-800 cursor-pointer text-center">
                            {uploadingFile === order.id ? "업로드 중..." : "결과 파일 업로드"}
                            <input
                              type="file"
                              accept=".pdf,.zip"
                              className="hidden"
                              disabled={uploadingFile === order.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(order, file);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => completeOrder(order)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                          >
                            파일 없이 완료
                          </button>
                        </>
                      )}

                      {order.order_status === "cancelling" && (
                        <button
                          onClick={() => cancelOrder(order)}
                          className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 active:bg-red-800"
                        >
                          취소 승인
                        </button>
                      )}

                      {(order.order_status === "pending" || order.order_status === "confirmed") && (
                        <button
                          onClick={() => cancelOrder(order)}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                        >
                          주문 취소
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          )}

          {/* Reviews Section */}
          {activeSection === "reviews" && <ReviewsManagement />}

          {/* Q&A Section */}
          {activeSection === "qna" && <QnAManagement />}
        </motion.div>
      </main>
    </div>
  );
}
