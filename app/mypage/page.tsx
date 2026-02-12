"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

import { useCart } from "@/contexts/CartContext";

export default function MyPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { items, removeItem } = useCart();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
                  <div className="bg-gray-50 p-6 flex justify-between items-center">
                    <span className="font-medium text-gray-900">총 결제금액</span>
                    <span className="text-xl font-bold text-blue-600">
                      {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div>
            <h2 className="mb-4 text-xl font-medium text-gray-900">주문내역</h2>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Empty State */}
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
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
