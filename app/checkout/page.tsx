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
      <div className="min-h-screen bg-background font-light text-foreground antialiased pb-20">
        <Header />

        {/* Background gradients */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 10%, rgba(198, 123, 92, 0.08) 0%, rgba(242, 238, 233, 0) 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-light text-foreground">주문/결제</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Analysis Targets */}
              <div className="rounded-2xl border border-woody-brown/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-medium text-foreground">분석 대상 정보</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-3">
                    이메일 (PDF 발송용) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="w-full rounded-xl border border-woody-brown/20 bg-sub-background px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                  />
                  <p className="text-xs text-foreground/40 mt-3">모든 분석 리포트가 이 이메일로 발송됩니다.</p>
                </div>
              </div>

              {/* 각 사람별 정보 입력 폼 */}
              {peopleForms.map((person, index) => (
                <div key={index} className="rounded-xl border border-woody-brown/10 bg-sub-background p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-terracotta">대상 {index + 1}</span>
                    {peopleForms.length > 1 && (
                      <button
                        onClick={() => {
                          setPeopleForms(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="text-xs text-foreground/40 hover:text-red-400 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        이름 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => updatePersonForm(index, "name", e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                      />
                    </div>
                    {index === 0 && (
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          연락처 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={person.phone}
                          onChange={(e) => updatePersonForm(index, "phone", e.target.value)}
                          placeholder="010-0000-0000"
                          className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        성별 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={person.gender}
                        onChange={(e) => updatePersonForm(index, "gender", e.target.value)}
                        className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                      >
                        <option value="" className="bg-white">성별을 선택하세요</option>
                        <option value="male" className="bg-white">남성</option>
                        <option value="female" className="bg-white">여성</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        생년월일 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={person.birthDate}
                        onChange={(e) => updatePersonForm(index, "birthDate", e.target.value)}
                        className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          양력/음력 <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={person.calendarType}
                          onChange={(e) => updatePersonForm(index, "calendarType", e.target.value)}
                          className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                        >
                          <option value="solar" className="bg-white">양력</option>
                          <option value="lunar" className="bg-white">음력</option>
                        </select>
                      </div>
                      {person.calendarType === "lunar" && (
                        <div className="flex items-end pb-1 md:pb-0">
                          <label className="flex items-center gap-2 px-2 md:px-4 py-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={person.isLeapMonth}
                              onChange={(e) => updatePersonForm(index, "isLeapMonth", e.target.checked)}
                              className="w-4 h-4 rounded border-woody-brown/20 bg-white text-terracotta focus:ring-terracotta"
                            />
                            <span className="text-sm text-foreground/70 whitespace-nowrap">윤달</span>
                          </label>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        태어난 시간 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={person.birthTime}
                        onChange={(e) => updatePersonForm(index, "birthTime", e.target.value)}
                        className="w-full rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                      >
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
                  </div>
                </div>
              ))}

              {/* 개인정보 수집 동의 */}
              <div className="rounded-2xl border border-woody-brown/10 bg-white p-6 shadow-sm">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-lg border-woody-brown/20 bg-sub-background text-terracotta focus:ring-terracotta/50 transition-all"
                  />
                  <div className="flex-1">
                    <span className="text-lg font-medium text-foreground group-hover:text-terracotta transition-colors">
                      개인정보 수집 및 이용 동의 <span className="text-red-400">*</span>
                    </span>
                    <p className="mt-3 text-xs text-foreground/40 leading-relaxed">
                      타라사주는 사주 분석 서비스 제공을 위해 이름, 연락처, 이메일, 생년월일, 성별, 출생시간 정보를 수집합니다.
                      수집된 개인정보는 서비스 제공 목적으로만 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* Coupon Section */}
              <div className="rounded-2xl border border-woody-brown/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-medium text-foreground">쿠폰 할인</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedCoupon?.id || ""}
                    onChange={(e) => {
                      const coupon = coupons.find(c => c.id === e.target.value);
                      applyCoupon(coupon);
                    }}
                    className="flex-1 rounded-xl border border-woody-brown/20 bg-white px-4 py-3 text-foreground outline-none focus:border-terracotta/50"
                  >
                    <option value="">사용 가능한 쿠폰을 선택하세요</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.id} value={coupon.id} className="bg-white">
                        {coupon.coupons.name} - {coupon.coupons.discount_value.toLocaleString()}
                        {coupon.coupons.discount_type === "fixed" ? "원" : "%"} 할인
                        (만료: {new Date(coupon.expires_at).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-woody-brown/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-medium text-foreground">결제 방식 선택</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl border p-4 text-center transition-all border-terracotta bg-terracotta/10 text-terracotta"
                  >
                    무통장 입금
                  </div>
                  <button
                    className="rounded-xl border border-woody-brown/10 bg-sub-background p-4 text-center text-foreground/20 cursor-not-allowed"
                    disabled
                  >
                    카드 결제 (준비중)
                  </button>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-sub-background text-sm text-foreground/70 space-y-2 border border-woody-brown/10">
                  <p className="flex justify-between"><span>• 은행</span> <span className="text-foreground font-medium">카카오뱅크</span></p>
                  <p className="flex justify-between"><span>• 계좌번호</span> <span className="text-terracotta font-mono font-medium">3333-36-585986</span></p>
                  <p className="flex justify-between"><span>• 예금주</span> <span className="text-foreground font-medium">고수빈(원포세븐)</span></p>
                  <div className="mt-4 pt-4 border-t border-woody-brown/10 text-center text-terracotta/90">
                    입금 확인 후 <span className="font-medium text-foreground">24시간 이내</span> 분석 리포트가 발송됩니다
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-woody-brown/10 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-medium text-foreground">주문 요약</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-foreground/60">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>쿠폰 할인</span>
                      <span>-{discountAmount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="border-t border-woody-brown/10 pt-4 flex justify-between">
                    <span className="text-lg font-medium text-foreground">총 결제 금액</span>
                    <span className="text-2xl font-bold text-terracotta">{(totalPrice - discountAmount).toLocaleString()}원</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full rounded-full bg-terracotta px-6 py-4 font-bold text-white shadow-sm transition-all hover:bg-terracotta/90 disabled:opacity-50"
                  >
                    {isLoading ? "처리중..." : `${(totalPrice - discountAmount).toLocaleString()}원 결제하기`}
                  </button>
                  <p className="text-center text-xs text-foreground/40">
                    무통장 입금의 경우, 입금 확인 후 분석이 시작됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
