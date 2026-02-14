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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-woody-brown/10 p-8 md:p-10 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/20 hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-3xl font-bold text-foreground mb-6">문의하기</h3>
        {productName && (
          <p className="text-sm text-terracotta mb-8">상품: {productName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="홍길동"
                className="w-full rounded-xl border border-woody-brown/10 bg-sub-background px-4 py-3.5 text-foreground placeholder:text-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all font-light"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                이메일 <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-woody-brown/10 bg-sub-background px-4 py-3.5 text-foreground placeholder:text-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all font-light"
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                비밀번호 <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="수정/삭제용 (4자 이상)"
                className="w-full rounded-xl border border-woody-brown/10 bg-sub-background px-4 py-3.5 text-foreground placeholder:text-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all font-mono"
                minLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                비밀번호 확인 <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="비밀번호 재입력"
                className="w-full rounded-xl border border-woody-brown/10 bg-sub-background px-4 py-3.5 text-foreground placeholder:text-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all font-mono"
                minLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              문의 내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="궁금하신 내용을 작성해주세요."
              className="w-full rounded-xl border border-woody-brown/10 bg-sub-background p-4 text-foreground placeholder:text-foreground/20 focus:border-terracotta/50 focus:outline-none focus:ring-1 focus:ring-terracotta/50 transition-all resize-none font-light"
              rows={6}
              maxLength={2000}
            />
            <div className="flex justify-between mt-2">
              <p className="text-[10px] text-foreground/40">답변 확인을 위한 이메일이 정확한지 확인해주세요.</p>
              <p className="text-[10px] text-foreground/20 font-mono">{formData.question.length} / 2000</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sub-background border border-woody-brown/10">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-5 h-5 rounded-lg border-woody-brown/20 bg-white text-terracotta focus:ring-terracotta/50 transition-all"
              />
              <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors">
                공개 (다른 사용자도 질문과 답변을 볼 수 있습니다)
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-woody-brown/10 bg-white px-4 py-4 text-sm font-medium text-foreground/60 transition-all hover:bg-sub-background"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-terracotta px-4 py-4 text-sm font-medium text-white transition-all hover:bg-terracotta/90"
            >
              {isSubmitting ? "등록중..." : "문의 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
