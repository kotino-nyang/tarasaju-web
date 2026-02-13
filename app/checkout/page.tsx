"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface PersonForm {
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  calendarType: string;
  isLeapMonth: boolean;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const [email, setEmail] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [peopleForms, setPeopleForms] = useState<PersonForm[]>([
    {
      name: "",
      phone: "",
      gender: "",
      birthDate: "",
      birthTime: "",
      calendarType: "solar",
      isLeapMonth: false,
    },
  ]);

  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    // 로그인 체크
    if (!isLoading && !user) {
      alert("로그인이 필요합니다.");
      router.push("/auth");
      return;
    }

    const fromCart = searchParams.get("fromCart");

    if (fromCart === "true") {
      // 장바구니에서 온 경우
      if (cartItems.length === 0) {
        alert("장바구니가 비어있습니다.");
        router.push("/mypage");
        return;
      }

      const count = cartItems.length;
      const price = cartItems.reduce((sum, item) => sum + item.price, 0);

      setPeopleCount(count);
      setTotalPrice(price);

      // 인원수만큼 폼 생성
      setPeopleForms(
        Array(count).fill(null).map(() => ({
          name: "",
          phone: "",
          gender: "",
          birthDate: "",
          birthTime: "",
          calendarType: "solar",
          isLeapMonth: false,
        }))
      );
    } else {
      // 직접 구매인 경우
      const baseQuantity = parseInt(searchParams.get("baseQuantity") || "1");
      const additionalQuantity = parseInt(searchParams.get("additionalQuantity") || "0");
      const price = parseInt(searchParams.get("totalPrice") || "0");

      if (!price) {
        alert("잘못된 접근입니다.");
        router.push("/analysis");
        return;
      }

      const count = baseQuantity + additionalQuantity;
      setPeopleCount(count);
      setTotalPrice(price);

      // 인원수만큼 폼 생성
      setPeopleForms(
        Array(count).fill(null).map(() => ({
          name: "",
          phone: "",
          gender: "",
          birthDate: "",
          birthTime: "",
          calendarType: "solar",
          isLeapMonth: false,
        }))
      );
    }

    // 사용자 이메일 자동 입력
    if (user?.email) {
      setEmail(user.email);
    }

    // 사용 가능한 쿠폰 조회
    if (user) {
      loadAvailableCoupons();
    }
  }, [user, isLoading, router, searchParams, cartItems]);

  const loadAvailableCoupons = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_coupons")
      .select(`
        *,
        coupons:coupon_id (*)
      `)
      .eq("user_id", user?.id)
      .eq("is_used", false)
      .gte("expires_at", new Date().toISOString());

    if (!error && data) {
      setCoupons(data);
    }
  };

  const applyCoupon = (coupon: any) => {
    if (!coupon) {
      setSelectedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    const couponInfo = coupon.coupons;
    let discount = 0;

    if (couponInfo.discount_type === "fixed") {
      discount = couponInfo.discount_value;
    } else if (couponInfo.discount_type === "percent") {
      discount = Math.floor(totalPrice * (couponInfo.discount_value / 100));
    }

    // 할인 금액이 상품 가격을 초과하지 않도록
    discount = Math.min(discount, totalPrice);

    setSelectedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const updatePersonForm = (index: number, field: keyof PersonForm, value: any) => {
    setPeopleForms((prev) => {
      const newForms = [...prev];
      newForms[index] = { ...newForms[index], [field]: value };
      return newForms;
    });
  };

  const handlePayment = async () => {
    // 이메일 검증
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 개인정보 동의 검증
    if (!agreePrivacy) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    // 모든 사람의 정보 검증
    for (let i = 0; i < peopleForms.length; i++) {
      const person = peopleForms[i];
      // 첫 번째 사람만 연락처 필수
      if (i === 0) {
        if (!person.name || !person.phone || !person.gender || !person.birthDate || !person.birthTime) {
          alert(`${i + 1}번째 분석 대상자의 정보를 모두 입력해주세요.`);
          return;
        }
      } else {
        if (!person.name || !person.gender || !person.birthDate || !person.birthTime) {
          alert(`${i + 1}번째 분석 대상자의 정보를 모두 입력해주세요.`);
          return;
        }
      }
    }

    const supabase = createClient();
    const finalAmount = totalPrice - discountAmount;

    try {
      const orderNumbers: string[] = [];

      // 각 사람마다 주문 생성
      for (let i = 0; i < peopleForms.length; i++) {
        const person = peopleForms[i];

        // 주문 번호 생성
        const { data: orderNumberData, error: orderNumberError } = await supabase
          .rpc("generate_order_number");

        if (orderNumberError) throw orderNumberError;

        const orderNumber = orderNumberData;
        orderNumbers.push(orderNumber);

        // 가격 계산 (첫 번째 사람은 기본가, 나머지는 추가가)
        const itemPrice = i === 0 ? 29800 : 24500;
        const itemDiscount = i === 0 ? discountAmount : 0; // 쿠폰은 첫 번째 주문에만 적용
        const itemFinalAmount = itemPrice - itemDiscount;

        // 주문 정보 저장 (연락처는 첫 번째 사람 것을 사용)
        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user?.id,
            order_number: orderNumber,
            product_name: "[불만족시 100%환불] 종합사주분석",
            option: i === 0 ? "종합사주분석 1인" : "종합사주분석 1인 추가",
            price: itemPrice,
            discount_amount: itemDiscount,
            final_amount: itemFinalAmount,
            coupon_id: i === 0 && selectedCoupon ? selectedCoupon.coupon_id : null,
            customer_name: person.name,
            customer_email: email,
            customer_phone: peopleForms[0].phone, // 첫 번째 사람의 연락처 사용
            gender: person.gender,
            birth_date: person.birthDate,
            birth_time: person.birthTime,
            calendar_type: person.calendarType,
            is_leap_month: person.isLeapMonth,
            payment_status: "pending",
            order_status: "pending",
          });

        if (orderError) throw orderError;
      }

      // 쿠폰 사용 처리
      if (selectedCoupon) {
        const { error: couponError } = await supabase
          .from("user_coupons")
          .update({
            is_used: true,
            used_at: new Date().toISOString(),
          })
          .eq("id", selectedCoupon.id);

        if (couponError) {
          console.error("쿠폰 사용 처리 실패:", couponError);
        }
      }

      // 장바구니 비우기
      clearCart();

      // 주문 완료 및 입금 안내
      alert(`주문이 완료되었습니다!\n\n주문번호: ${orderNumbers.join(", ")}\n총 ${peopleCount}명 분석\n\n▼ 입금 계좌 정보\n• 은행: 카카오뱅크\n• 계좌번호: 3333-36-585986\n• 예금주: 고수빈(원포세븐)\n• 입금 금액: ${finalAmount.toLocaleString()}원\n\n입금 확인 후 24시간 이내에 분석 리포트가 이메일(${email})로 발송됩니다.`);

      // 마이페이지로 이동
      router.push("/mypage");
    } catch (error) {
      console.error("주문 처리 실패:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050d1a]">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[#050d1a] pt-32 pb-20 text-white">
        {/* Background gradients */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.1) 0%, rgba(5, 13, 26, 0) 70%)",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">주문/결제</h1>
            <p className="text-[#60a5fa] mb-10 font-light">총 {peopleCount}명의 사주분석을 신청합니다</p>

            {/* 공통 이메일 */}
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.1)]">
              <h2 className="text-2xl font-bold mb-6">이메일 정보</h2>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">
                  이메일 (PDF 발송용) <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                />
                <p className="text-xs text-white/30 mt-3">모든 분석 리포트가 이 이메일로 발송됩니다.</p>
              </div>
            </div>

            {/* 각 사람별 정보 입력 폼 */}
            {peopleForms.map((person, index) => (
              <div key={index} className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.1)]">
                <h2 className="text-2xl font-bold mb-6">
                  {index + 1}번째 분석 대상자 정보 {index === 0 && <span className="text-sm font-normal text-[#60a5fa] px-2 py-1 rounded-md bg-white/5 ml-2">기본</span>}
                  {index > 0 && <span className="text-sm font-normal text-white/40 ml-2">(추가)</span>}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      이름 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updatePersonForm(index, "name", e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light"
                    />
                  </div>
                  {index === 0 && (
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        연락처 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={person.phone}
                        onChange={(e) => updatePersonForm(index, "phone", e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light font-mono"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      성별 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={person.gender}
                      onChange={(e) => updatePersonForm(index, "gender", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light"
                    >
                      <option value="" className="bg-[#0f172a]">성별을 선택하세요</option>
                      <option value="male" className="bg-[#0f172a]">남성</option>
                      <option value="female" className="bg-[#0f172a]">여성</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      생년월일 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={person.birthDate}
                      onChange={(e) => updatePersonForm(index, "birthDate", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light font-mono"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        양력/음력 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={person.calendarType}
                        onChange={(e) => updatePersonForm(index, "calendarType", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light"
                      >
                        <option value="solar" className="bg-[#0f172a]">양력</option>
                        <option value="lunar" className="bg-[#0f172a]">음력</option>
                      </select>
                    </div>
                    {person.calendarType === "lunar" && (
                      <div className="flex items-end pb-1 md:pb-0">
                        <label className="flex items-center gap-2 px-2 md:px-4 py-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={person.isLeapMonth}
                            onChange={(e) => updatePersonForm(index, "isLeapMonth", e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#3b82f6] focus:ring-[#3b82f6]"
                          />
                          <span className="text-sm text-white/70 whitespace-nowrap">윤달</span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      태어난 시간 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={person.birthTime}
                      onChange={(e) => updatePersonForm(index, "birthTime", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light"
                    >
                      <option value="" className="bg-[#0f172a]">시간을 선택하세요</option>
                      <option value="unknown" className="bg-[#0f172a]">모름 (00시 기준 분석)</option>
                      <option value="ja" className="bg-[#0f172a]">자시 (23:30-01:30)</option>
                      <option value="chuk" className="bg-[#0f172a]">축시 (01:30-03:30)</option>
                      <option value="in" className="bg-[#0f172a]">인시 (03:30-05:30)</option>
                      <option value="myo" className="bg-[#0f172a]">묘시 (05:30-07:30)</option>
                      <option value="jin" className="bg-[#0f172a]">진시 (07:30-09:30)</option>
                      <option value="sa" className="bg-[#0f172a]">사시 (09:30-11:30)</option>
                      <option value="o" className="bg-[#0f172a]">오시 (11:30-13:30)</option>
                      <option value="mi" className="bg-[#0f172a]">미시 (13:30-15:30)</option>
                      <option value="sin" className="bg-[#0f172a]">신시 (15:30-17:30)</option>
                      <option value="yu" className="bg-[#0f172a]">유시 (17:30-19:30)</option>
                      <option value="sul" className="bg-[#0f172a]">술시 (19:30-21:30)</option>
                      <option value="hae" className="bg-[#0f172a]">해시 (21:30-23:30)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* 개인정보 수집 동의 */}
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.1)]">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-white/10 bg-white/5 text-[#3b82f6] focus:ring-[#3b82f6]/50 transition-all"
                />
                <div className="flex-1">
                  <span className="text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                    개인정보 수집 및 이용 동의 <span className="text-red-400">*</span>
                  </span>
                  <p className="mt-3 text-xs text-white/40 leading-relaxed font-light">
                    타라사주는 사주 분석 서비스 제공을 위해 이름, 연락처, 이메일, 생년월일, 성별, 출생시간 정보를 수집합니다.
                    수집된 개인정보는 서비스 제공 목적으로만 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
                  </p>
                </div>
              </label>
            </div>

            {/* 결제 정보 */}
            <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.1)]">
              <h2 className="text-2xl font-bold mb-8">결제 정보</h2>

              {/* 결제 방식 */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-white/70 mb-4">
                  결제 방식
                </label>
                <div className="rounded-2xl border-2 border-[#3b82f6]/30 bg-blue-500/5 px-6 py-6 shadow-[0_0_24px_rgba(59,130,246,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-[#60a5fa]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-white">무통장 입금</span>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-black/20 text-sm text-white/70 space-y-2 border border-white/5 font-light">
                    <p className="flex justify-between"><span>• 은행</span> <span className="text-white font-medium">카카오뱅크</span></p>
                    <p className="flex justify-between"><span>• 계좌번호</span> <span className="text-[#60a5fa] font-mono font-medium">3333-36-585986</span></p>
                    <p className="flex justify-between"><span>• 예금주</span> <span className="text-white font-medium">고수빈(원포세븐)</span></p>
                    <div className="mt-4 pt-4 border-t border-white/5 text-center text-[#60a5fa]/90">
                      입금 확인 후 <span className="font-medium text-white">24시간 이내</span> 분석 리포트가 발송됩니다
                    </div>
                  </div>
                </div>
              </div>

              {/* 쿠폰 적용 */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-white/70 mb-4">
                  할인 쿠폰 {coupons.length > 0 && <span className="text-[#60a5fa] font-bold">({coupons.length}장 보유)</span>}
                </label>
                {coupons.length > 0 ? (
                  <select
                    value={selectedCoupon?.id || ""}
                    onChange={(e) => {
                      const coupon = coupons.find(c => c.id === e.target.value);
                      applyCoupon(coupon);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-white focus:border-[#3b82f6]/50 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-light"
                  >
                    <option value="" className="bg-[#0f172a]">사용 가능한 쿠폰을 선택하세요</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.id} value={coupon.id} className="bg-[#0f172a]">
                        {coupon.coupons.name} - {coupon.coupons.discount_value.toLocaleString()}
                        {coupon.coupons.discount_type === "fixed" ? "원" : "%"} 할인
                        (만료: {new Date(coupon.expires_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white/20 text-sm font-light text-center">
                    사용 가능한 쿠폰이 없습니다
                  </div>
                )}
              </div>

              {/* 결제 금액 */}
              <div className="space-y-4 bg-black/20 rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between text-white/60 font-light">
                  <span>상품 금액 ({peopleCount}명)</span>
                  <span className="font-mono">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-white/60 font-light">
                  <span>할인 금액</span>
                  <span className="text-red-400/80 font-mono">-{discountAmount.toLocaleString()}원</span>
                </div>
                {selectedCoupon && (
                  <div className="flex items-center gap-2 text-sm text-[#60a5fa] bg-blue-500/10 px-3 py-1.5 rounded-lg w-fit">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="font-medium">{selectedCoupon.coupons.name} 적용됨</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                  <span className="text-lg font-bold">최종 입금 금액</span>
                  <span className="text-3xl font-bold text-[#60a5fa] drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] font-mono">
                    {(totalPrice - discountAmount).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 주문 완료 버튼 */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full rounded-2xl bg-blue-600 px-8 py-5 text-xl font-bold text-white transition-all hover:bg-blue-500 shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_48px_rgba(59,130,246,0.6)]"
            >
              {(totalPrice - discountAmount).toLocaleString()}원 주문하기
            </motion.button>

            <p className="mt-6 text-center text-sm text-white/20 font-light">
              주문 완료 후 입금 계좌 정보가 다시 한 번 안내됩니다.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050d1a]">
        <div className="text-white">로딩 중...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
