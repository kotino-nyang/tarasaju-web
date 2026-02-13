"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { maskName, maskEmail } from "@/lib/utils/nameMask";

interface Review {
  id: string;
  order_id: string;
  user_id: string | null;
  rating: number;
  content: string;
  is_approved: boolean;
  admin_reply: string | null;
  admin_replied_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  orders: {
    order_number: string;
    customer_name: string;
    customer_email: string;
  };
}

type ReviewFilter = "all";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [reviews, filter]);

  const loadReviews = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        orders (
          order_number,
          customer_name,
          customer_email
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as any);
    } else {
      console.error("리뷰 로딩 실패:", error);
    }
    setIsLoading(false);
  };

  const applyFilter = () => {
    setFilteredReviews([...reviews]);
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("이 리뷰를 삭제하시겠습니까?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      alert("리뷰가 삭제되었습니다.");
      loadReviews();
    }
  };

  const submitReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({
        admin_reply: replyText,
        admin_replied_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (error) {
      alert("답변 등록 실패: " + error.message);
    } else {
      alert("답변이 등록되었습니다.");
      setReplyText("");
      setSelectedReview(null);
      loadReviews();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getStats = () => {
    const total = reviews.length;
    const avgRating =
      total > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : "0.0";

    return { total, avgRating };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">전체 리뷰</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.total}개</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">평균 평점</p>
          <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.avgRating}점</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">해당하는 리뷰가 없습니다.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="font-medium text-gray-900">
                      {maskName(review.orders.customer_name)}
                    </p>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500">
                    주문번호: {review.orders.order_number} | {maskEmail(review.orders.customer_email)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {review.content}
                </p>
                {(review as any).image_url && (
                  <img
                    src={(review as any).image_url}
                    alt="Review"
                    className="mt-3 w-full max-w-md h-auto rounded-lg border border-gray-200"
                  />
                )}
              </div>

              {review.admin_reply && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">관리자 답변</p>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">
                    {review.admin_reply}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {review.admin_replied_at &&
                      new Date(review.admin_replied_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedReview(
                      selectedReview?.id === review.id ? null : review
                    );
                    setReplyText(review.admin_reply || "");
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  {selectedReview?.id === review.id ? "답변 취소" : "답변하기"}
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
                >
                  삭제
                </button>
              </div>

              {selectedReview?.id === review.id && (
                <div className="mt-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="답변 내용을 입력하세요..."
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={4}
                  />
                  <button
                    onClick={() => submitReply(review.id)}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
                  >
                    답변 등록
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
