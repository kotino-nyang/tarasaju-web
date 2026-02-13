"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hashPassword } from "@/lib/utils/passwordHash";

interface QnAFormProps {
  productName?: string;
  orderId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function QnAForm({ productName, orderId, onSuccess, onClose }: QnAFormProps) {
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    password: "",
    passwordConfirm: "",
    question: "",
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.authorName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!formData.authorEmail.trim() || !formData.authorEmail.includes("@")) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      alert("비밀번호는 4자 이상 입력해주세요.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.question.trim()) {
      alert("질문 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Hash password
    const passwordHash = await hashPassword(formData.password);

    const { error } = await supabase.from("qna").insert({
      user_id: user?.id || null,
      author_name: formData.authorName.trim(),
      author_email: formData.authorEmail.trim(),
      password_hash: passwordHash,
      question: formData.question.trim(),
      is_public: formData.isPublic,
      product_name: productName || null,
      order_id: orderId || null,
    });

    if (error) {
      alert("문의 등록 실패: " + error.message);
    } else {
      alert("문의가 등록되었습니다. 마이페이지에서 답변을 확인하실 수 있습니다.");
      setFormData({
        authorName: "",
        authorEmail: "",
        password: "",
        passwordConfirm: "",
        question: "",
        isPublic: true,
      });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">문의하기</h3>
        {productName && (
          <p className="text-sm text-gray-600 mb-6">상품: {productName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="홍길동"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">답변 확인을 위한 연락처로 사용됩니다.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="문의 수정/삭제시 필요 (4자 이상)"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              minLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              minLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              문의 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="궁금하신 내용을 작성해주세요."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.question.length}/2000</p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                공개 (다른 사용자도 질문과 답변을 볼 수 있습니다)
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? "등록중..." : "문의 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
