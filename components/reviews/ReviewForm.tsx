"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ReviewFormProps {
  onClose: () => void;
  productName: string;
  orderId?: string;
}

export default function ReviewForm({ onClose, productName, orderId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    checkAuth();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      alert("구매평 내용을 입력해주세요.");
      return;
    }

    if (content.length > 1000) {
      alert("구매평은 1000자 이하로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    // If orderId is not provided, we'll need to find a completed order
    let finalOrderId = orderId;

    if (!finalOrderId) {
      // Find a completed order for this user
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .eq("order_status", "completed")
        .limit(1);

      if (orderError || !orders || orders.length === 0) {
        alert("구매평을 작성할 수 있는 완료된 주문이 없습니다.");
        setIsSubmitting(false);
        return;
      }

      finalOrderId = orders[0].id;
    }

    // Upload image if provided
    let imageUrl: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `review-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        setIsSubmitting(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('reviews')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("reviews").insert({
      order_id: finalOrderId,
      user_id: userId,
      rating,
      content: content.trim(),
      image_url: imageUrl,
      is_approved: true,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Review submission error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      alert(`구매평 등록에 실패했습니다.\n\n${error.message || "알 수 없는 오류가 발생했습니다."}\n\n관리자에게 문의해주세요.`);
    } else {
      alert("구매평이 등록되었습니다!");
      onClose();
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <svg
              className={`w-10 h-10 ${
                star <= rating ? "text-yellow-400" : "text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="border-b border-gray-200 p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">구매평 작성</h2>
          <p className="text-sm text-gray-500">{productName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              평점 <span className="text-red-500">*</span>
            </label>
            {renderStars()}
            <p className="text-center text-sm text-gray-500 mt-2">{rating}점</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              구매평 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상품에 대한 솔직한 평가를 남겨주세요. (최대 1000자)"
              className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {content.length} / 1000자
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              사진 첨부 (선택)
            </label>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-gray-50">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">클릭하여 이미지 업로드</p>
                <p className="text-xs text-gray-400 mt-1">최대 5MB, JPG/PNG</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-700">
              • 상품과 무관한 내용이나 부적절한 내용은 삭제될 수 있습니다.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? "등록중..." : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
